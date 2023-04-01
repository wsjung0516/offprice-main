import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  merge,
  Observable,
  skip,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
// import { Nft } from '../../models/sale-list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import { CategoryMenuComponent } from '../../../layout/components/sidebar/category-menu/category-menu.component';
import { SaleListHeaderComponent } from '../sale-list-header/sale-list-header.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  ChipsKeywordService,
  SearchKeyword,
} from 'src/app/core/services/chips-keyword.service';
import { ShowMenuDialogService } from 'src/app/core/services/show-menu-dialog.service';
import { SaleListService } from './sale-list.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
// import {ISaleList} from "../../models/sale-list";
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
  CommonModule,
    MatCardModule,
    SaleListHeaderComponent,
    CategoryMenuComponent,
    ScrollingModule,
  ],

  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styles: [
    `
      .viewport {
        width: 100%;
        height: 86vh;
        overflow-y: auto;
      }

      .image-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleListComponent implements OnInit, AfterViewInit {
  // nft: Array<ISaleList>;
  currentScreenSize: string;
  public screenSize$: Observable<any>;
  sSize: string;
  keywords: SearchKeyword[] = [];
  scrollObservable = new BehaviorSubject<any>({ scroll: { skip: 0, take: 20 } });
  scrollObservable$ = this.scrollObservable.asObservable();

  constructor(
    private http: HttpClient,
    public screenSizeService: ScreenSizeService,
    private chipsKeywordService: ChipsKeywordService,
    private showMenuDialogService: ShowMenuDialogService,
    private saleListService: SaleListService,
    private cd: ChangeDetectorRef,
    private localStorageService: LocalStorageService
  ) {
    this.screenSize$ = this.screenSizeService.screenSize$;
  }
  images: any[] = [];
  itemSize: number = 60; // 이미지의 높이를 설정합니다. 적절한 값을 선택하십시오.

  ngOnInit(): void {
    this.makeWhereObservable();
    // make chips for display in the DOM
    this.chipsKeywordService.searchKeyword$
      .pipe(untilDestroyed(this))
      .subscribe((result: any[]) => {
        this.keywords = [];
        result.forEach((obj) => {
          if (obj.value !== '' && obj.key === 'keyword')
            this.keywords.push(obj);
          if (obj.value !== 'All' && obj.key !== 'keyword')
            this.keywords.push(obj);
          this.cd.detectChanges();
        });
      });
    //
    this.screenSize$.pipe(untilDestroyed(this)).subscribe((result) => {
      this.sSize = result;
    });
  }
  ngAfterViewInit() {
    this.makeSortNWhereCondition().subscribe((data: any) => {
      const newImages = data.map((obj: any) => ({
        url: obj.image_url,
        vendor: obj.vendor,
        price: obj.price,
        size: obj.size,
      }));
      this.images = [...this.images, ...newImages];
      // console.log('result - image', this.images);
      this.cd.detectChanges();
      this.getConditionalSaleListLength();
    });
  }
  private getConditionalSaleListLength() {
    this.saleListService
      .getConditionalSaleListLength()
      .subscribe((res: number) => {
        console.log('getConditionalSaleListLength', res);
        // This value is used to display the number of items, which is searched.
        // And used at the sale-list-header.component.ts
        this.localStorageService.setItem('searchItemsLength', res.toString());
      });
  }
  onScroll(index: number) {
    // 이미지 로딩이 필요한지 확인하고, 필요한 경우 추가 이미지를 로드합니다.
    if (index + 20 > this.images.length) {
      this.scrollObservable.next({
        scroll: { skip: this.images.length, take: 20 },
      });
    }
  }

  loadImages(skip: number, take: number) {}
  /**
  0:{vendor: 'All'}
  1:{price: '10, 25'}
  2:{category: 'Tops'}
  3:{size: 'XS'}
  4:{material: 'Wool'}
  5:{search_period: 2}
  6:{keyword: 'aaa'}
  */

  searchConditionObservable$: Observable<any>;
  private makeWhereObservable() {
    let andArray: any[] = [];
    let orArray: any[] = [];
    /**
     * 1. display dialog menu (category, size, price, material, search period)
     * 2. select one item and call the behavior subject, which is at the service( show-menu-dialog.service)
     * 3. get the value from the behavior subject as below.
     * 4. combine all the behavior subject and make the where condition.
     */
    const vendor$ = this.showMenuDialogService.vendor$;
    const price$ = this.showMenuDialogService.price$;
    const category$ = this.showMenuDialogService.category$;
    const size$ = this.showMenuDialogService.size$;
    const material$ = this.showMenuDialogService.material$;
    const search_period$ = this.showMenuDialogService.search_period$;
    const keywords$ = this.showMenuDialogService.keywords$;

    this.searchConditionObservable$ = combineLatest([
      vendor$,
      price$,
      category$,
      size$,
      material$,
      search_period$,
      keywords$,
    ]).pipe(
      untilDestroyed(this),
      map(
        ([vendor, price, category, size, material, search_period, keyword]) => {
          andArray = [];
          orArray = [];
          if (vendor !== 'All') andArray.push({ vendor: vendor });
          if (price !== 'All') {
            const pric = price.split(',');
            andArray.push({ price: { gt: +pric[0], lt: +pric[1] } });
          }
          if (category !== 'All') andArray.push({ category: category });
          if (size !== 'All') andArray.push({ size: size });
          if (material !== 'All') andArray.push({ material: material });
          if (search_period !== 'All') {
            console.log('search_period', search_period, andArray);
            const day: number = +search_period;
            andArray.push({
              updated_at: {
                gte: new Date(
                  new Date(new Date().setDate(new Date().getDate() - day))
                    .toISOString()
                    .substring(0, 10)
                ),
              },
            });
          }
          if (keyword !== '') {
            // This value used for OR condition
            orArray.push({ vendor: { contains: keyword } });
            orArray.push({ description: { contains: keyword } });
          }
          return { where: { and: andArray, or: orArray } };
        }
      )
    );
  }
  oldScroll: any = null;
  private makeSortNWhereCondition(): Observable<any> {
    let where: any[] = [];
    let whereOR: any[] = [];
    let scroll: {} = null;
    return merge(this.scrollObservable$, this.searchConditionObservable$).pipe(
      untilDestroyed(this),
      map((data: any) => {
        // console.log('data', data);
        // where and condition event is triggered. (price, category, size, material, search_period)
        if (data.where && data.where['and'].length > 0) {
          where = data.where['and'];
          // Reset the image array when the where condition is changed.
          this.images = [];
        } else if (data.where && data.where['and'].length === 0) {
          where = null;
        }
        // where or condition event is triggered. (vendor, description)
        if (data.where && data.where['or'].length > 0) {
          whereOR = data.where['or'];
        } else if (data.where && data.where['or'].length === 0) {
          whereOR = null;
        }
        // scroll event is triggered.
        if (data.scroll) {
          scroll = data.scroll;
          this.oldScroll = data.scroll;
        } else {
          scroll = this.oldScroll;
        }
        return { where, whereOR, scroll };
      }),
      switchMap((data: any) => {
        const { where, scroll, whereOR } = data;
        return this.saleListService.getSaleLists(
          scroll.skip, // skip
          scroll.take, // take
          where, // where is used for AND condition (price, category, size, material, search_period)
          whereOR // whereOR is used for OR condition (vendor, description)
        );
      })
    );
  }
  onSearchKeyword(val: string) {
    this.showMenuDialogService.keywords.next(val);
    const value = { key: 'keyword', value: val };
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
  }
  inputKeyword: string = '';
  removeChipsKeyword(keyword: SearchKeyword) {
    const value = { key: keyword['key'], value: keyword['value'] };
    // Remove chip from the chips array
    this.chipsKeywordService.removeChipKeyword(value);
    // console.log('removeChipsKeyword', keyword['key']);
    if (keyword['key'] === 'price') {
      this.showMenuDialogService.price.next('All');
    } else if (keyword['key'] === 'category') {
      this.showMenuDialogService.category.next('All');
    } else if (keyword['key'] === 'size') {
      this.showMenuDialogService.size.next('All');
    } else if (keyword['key'] === 'material') {
      this.showMenuDialogService.material.next('All');
    } else if (keyword['key'] === 'search_period') {
      this.showMenuDialogService.search_period.next('All');
    } else if (keyword['key'] === 'keyword') {
      this.showMenuDialogService.keywords.next('');
      // clear search keyword
      console.log('clear search keyword');
      this.inputKeyword = '';
      this.cd.detectChanges();
    }
  }
  ngOnDestroy() {
    console.log('sale list destroy');
    // localStorage.setItem(
    //   'whereValue',
    //   JSON.stringify(this.where)
    // );
  }
}
