import {
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  Observable,
} from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import {
  ChipsKeywordService,
  SearchKeyword,
} from 'src/app/core/services/chips-keyword.service';
import { SaleListService } from './sale-list.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MakeWhereConditionService } from 'src/app/core/services/make-where-condition.service';
import { SaleList } from 'src/app/core/models/sale-list.model';
import { DetailsItemComponent } from 'src/app/core/components/details-item/details-item.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
  CommonModule,
    MatCardModule,
    ScrollingModule,
    MatDialogModule
  ],

  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styles: [
    `
      .viewport {
        width: 100%;
        height: 84vh;
        overflow-y: auto;
      }

      .image-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .xsmall_box {
        margin-top: 2rem;
      }
      
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MakeWhereConditionService, SaleListService],
})
export class SaleListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('viewport',{static: false}) viewport: CdkVirtualScrollViewport;
  // 
  currentScreenSize: string;
  public screenSize$: Observable<any>;
  sSize: string;
  keywords: SearchKeyword[] = [];
  showScrollToTop = true;

  constructor(
    public screenSizeService: ScreenSizeService,
    private chipsKeywordService: ChipsKeywordService,
    private saleListService: SaleListService,
    private cd: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private makeWhereConditionService: MakeWhereConditionService,
    private dialog: MatDialog
  ) {
    this.screenSize$ = this.screenSizeService.screenSize$;
  }
  images: any[] = [];
  itemSize: number = 60; // 이미지의 높이를 설정합니다. 적절한 값을 선택하십시오.

  ngOnInit(): void {
    // 
    // make chips for display in the DOM
    localStorage.setItem('displayMode', 'grid');

    this.chipsKeywordService.searchKeyword$
      .pipe(untilDestroyed(this))
      .subscribe((result: any[]) => {
        this.keywords = [];
        result.forEach((obj) => {
          if (obj.value !== '' && obj.key === 'input_keyword')
            this.keywords.push(obj);
          if (obj.value !== 'All' && obj.key !== 'input_keyword')
            this.keywords.push(obj);
          this.cd.detectChanges();
        });
      });
    //
    this.screenSize$.pipe(untilDestroyed(this)).subscribe((result) => {
      this.sSize = result;
      this.cd.detectChanges();
    });
  }
  ngAfterViewInit() {
    // 
    this.makeWhereConditionService.condition$
    .pipe(untilDestroyed(this)).subscribe((data:SaleList[]) => {
      this.images = [...this.images, ...data];
      this.cd.detectChanges();
      this.getConditionalSaleListLength();

    })
    //
    this.makeWhereConditionService.resetImages$.pipe(untilDestroyed(this))
    .subscribe((data:any) => {
      this.images = [];
    })
  }
  private getConditionalSaleListLength() {
    this.saleListService
      .getConditionalSaleListLength()
      .subscribe((res: number) => {
        // This value is used to display the number of items, which is searched.
        // And used at the sale-list-header.component.ts
        this.localStorageService.setItem('searchItemsLength', res.toString());
      });
  }
  onScroll(index: number) {
    // 
    if (index + 20 > this.images.length) {
      this.makeWhereConditionService.scrollObservable.next({
        skip: this.images.length, take: 20,
      });
    }
    index > 1 ? (this.showScrollToTop = true) : (this.showScrollToTop = false);
  }

  ngOnDestroy() {
    // console.log('sale list destroy');
    this.makeWhereConditionService.resetService()
  }

  scrollToTop() {
    console.log('scrollToTop clicked')
    this.viewport.scrollToIndex(0);
    }
  selectImage(image: UserSaleList  ) {
    // console.log('detailSaleItem', row);
    const dialogRef = this.dialog.open(DetailsItemComponent, {
      data: image
    });

    dialogRef.afterClosed().subscribe(result => {
      if( result === 'save' ) {
      // check if the item is already saved.

      } else if( result === 'delete' ) {

      }
      console.log('The dialog was closed', result);
    })
  }
}
