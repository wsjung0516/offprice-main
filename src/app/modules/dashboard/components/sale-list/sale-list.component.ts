import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  WritableSignal,
  computed,
  effect,
  signal
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { DialogService } from '@ngneat/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { CartItemsComponent } from 'src/app/core/components/cart-items/cart-items.component';
import { DetailsItemComponent } from 'src/app/core/components/details-item/details-item.component';
import { SaleList } from 'src/app/core/models/sale-list.model';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import {
  ChipsKeywordService,
  SearchKeyword,
} from 'src/app/core/services/chips-keyword.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MakeWhereConditionService2 } from 'src/app/core/services/make-where-condition.service2';
import { MakeWhereConditionService } from 'src/app/core/services/make-where-condition.service';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { SaleListService } from './sale-list.service';
import { toObservable } from '@angular/core/rxjs-interop';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
CommonModule,
    MatCardModule,
    ScrollingModule,
    MatDialogModule,
    CartItemsComponent,
  ],

  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styles: [
    `
    $header-height: 27vh;
      .viewport {
        width: 100%;
        /* height: calc( 100vh - #{$header-height} ); */
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
      .text-center {
        line-height: 0.8;
      }
      .text-xs {
        margin: 0;
        padding: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MakeWhereConditionService, SaleListService],
})
export class SaleListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('viewport', { static: false }) viewport: CdkVirtualScrollViewport;
  //
  viewportHeight: string;
  currentScreenSize: string;
  screenSize$: Observable<any>;
  sSize: string;
  showScrollToTop = true;
  // itemSize: number; // 이미지의 높이를 설정합니다. 적절한 값을 선택하십시오.
  isLoggedIn: boolean;
  itemSize = this.screenSizeService.itemSize; // itemSize = signal<number | undefined>(undefined);
  takeImage = this.screenSizeService.takeImage; // takeImage = signal<number>(20);
  images = this.makeWhereConditionService.images; // images = signal<SaleList[]>([]);


  constructor(
    public screenSizeService: ScreenSizeService,
    private chipsKeywordService: ChipsKeywordService,
    private makeWhereConditionService: MakeWhereConditionService2,
    private sessionStorageService: SessionStorageService,
    private dialogService: DialogService,
    private titleService: Title,
    private metaTagService: Meta,
    private ngZone: NgZone,
    private saleListService: SaleListService,
  ) {
    this.updateViewportHeight();
    effect(() => {
      // console.log('searchItemsLength -2 ', this.searchItemsLength());
  
    });

  }

  trackByFn(index: number, item: SaleList ) {
    return item.sale_list_id;
  }
  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    this.updateViewportHeight();
  }
  updateViewportHeight() {
    // 높이를 계산하고 "viewportHeight" 속성에 할당합니다.
    const headerHeight = 225; // 헤더 높이를 원하는 값으로 변경합니다.
    // const headerHeight = 209; // 헤더 높이를 원하는 값으로 변경합니다.
    this.viewportHeight = `calc(100vh - ${headerHeight}px)`;
  }

  keywords = computed(() => this.chipsKeywordService.searchKeyword().filter(
    (obj: any) => (obj.value !== '' && obj.key === 'input_keyword') ||
                  (obj.value !== 'All' && obj.key !== 'input_keyword')
  ))
  ngOnInit(): void {
    //
    // this.searchItemsLength.set(this.takeImage())
    this.metaTagService.updateTag(
      {
        name: 'description',
        content: 'offPrice.store is an online wholesale marketplace that sells clothes in bulk at low prices. Customers can easily and quickly search for and purchase products.',
      },
    );
    // make chips for display in the DOM
    this.sessionStorageService.setItem('displayMode', 'grid');
    // Keyword that is filtered from ChipsKeywordService, then displayed in the DOM
  }
  ngAfterViewInit() {
    //
    this.titleService.setTitle('off price closeout marketplace');
    this.sessionStorageService.setItem('title', 'offPrice');
  }
  onScroll(index: number) {
    this.saleListService.getConditionalSaleListLength();
    console.log('scroll index: ', index, this.takeImage(), this.images().length);
    this.ngZone.runOutsideAngular(() => {
      let takeImage = this.takeImage();
      if (index + takeImage > this.images().length ) {
        // if( this.searchItemsLength() !== 0 && this.images().length + takeImage > this.searchItemsLength() ) {
        //   takeImage = (this.searchItemsLength() - this.images().length);
        // }
        this.makeWhereConditionService.scrollData.set({
          skip: this.images().length,
          take: takeImage,
        });
        // this.makeWhereConditionService.scrollObservable.next({
        //   skip: this.images().length,
        //   take: takeImage,
        // });
      }
      index > 1 ? (this.showScrollToTop = true) : (this.showScrollToTop = false);
    });
  }

  ngOnDestroy() {
    // console.log('sale list destroy');
    this.makeWhereConditionService.resetService();
  }

  scrollToTop() {
    console.log('scrollToTop clicked');
    this.viewport.scrollToIndex(0);
  }
  async selectImage(image: UserSaleList) {
    // console.log('detailSaleItem', row);
    const mobileMode = window.matchMedia('(max-width: 576px)').matches;
    const width = mobileMode ? '100%' : '58%';
    const dialogRef = this.dialogService.open(DetailsItemComponent, {
       data: {
        data: image,
       },
      width: width,
       // height: 'auto',
    });

    dialogRef.afterClosed$.subscribe((result) => {
      if (result === 'save') {
        // check if the item is already saved.
      } else if (result === 'delete') {
      }
    });
  }
}
