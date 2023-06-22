import {
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
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
import { CartItemsComponent } from 'src/app/core/components/cart-items/cart-items.component';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { DialogService } from '@ngneat/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Meta, Title } from '@angular/platform-browser';
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
    private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private dialogService: DialogService,
    private breakpointObserver: BreakpointObserver,
    private titleService: Title,
    private metaTagService: Meta,
  ) {
    this.screenSize$ = this.screenSizeService.screenSize$;
    this.updateViewportHeight();
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.itemSize = 140;
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.itemSize = 100;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.itemSize = 80;
        } else if (result.breakpoints[Breakpoints.Large]) {
          this.itemSize = 60;
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          this.itemSize = 60;
        }
      }
    });
  }
  images: any[] = [];
  showingImages: any[] = [];
  itemSize: number; // 이미지의 높이를 설정합니다. 적절한 값을 선택하십시오.
  // itemSize: number = 60; // 이미지의 높이를 설정합니다. 적절한 값을 선택하십시오.
  isLoggedIn: boolean;

  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    this.updateViewportHeight();
  }
  updateViewportHeight() {
    // 높이를 계산하고 "viewportHeight" 속성에 할당합니다.
    const headerHeight = 225; // 헤더 높이를 원하는 값으로 변경합니다.
    // const headerHeight = 209; // 헤더 높이를 원하는 값으로 변경합니다.
    this.viewportHeight = `calc(100vh - ${headerHeight}px)`;
  }
  ngOnInit(): void {
    //
    this.metaTagService.updateTag(
      {
        name: 'description',
        content: 'offPrice.store is an online wholesale marketplace that sells clothes in bulk at low prices. Customers can easily and quickly search for and purchase products.',
      },
    );
    // make chips for display in the DOM
    this.sessionStorageService.setItem('displayMode', 'grid');
    // Keyword that is filtered from ChipsKeywordService, then displayed in the DOM
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
    this.setScreenSize();
  }
  ngAfterViewInit() {
    //
    this.titleService.setTitle('off price closeout marketplace');
    this.sessionStorageService.setItem('title', 'offPrice');

    this.makeWhereConditionService.condition$
      .pipe(untilDestroyed(this))
      .subscribe((data: SaleList[]) => {
        this.images = [...this.images, ...data];
        this.showingImages = [...this.images, ...data].filter((item) => item.status1 === 'Sale');
        // There may be different searchItemsLength value of showing images because of omitted images,
        // which has the status1 as 'Canceled', 'Sold','Reserved'.
        this.cd.detectChanges();
        this.getConditionalSaleListLength();
      });
    //
    this.makeWhereConditionService.resetImages$
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        // console.log('resetImages: ', data);
        this.images = [];
        this.showingImages = [];
      });
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
  takeImage = 20;
  setScreenSize() {
    this.screenSizeService.screenSize$
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if ( result === 'XSmall') { // xs
          this.takeImage = 6;
        } else if ( result === 'Small') { // sm 
          this.takeImage = 8;
        } else if ( result === 'Medium') { // md
          this.takeImage = 12;
        } else if ( result === 'Large') { // lg
          this.takeImage = 16;
        } else if ( result === 'XLarge') { // xl  
          this.takeImage = 20;
        }
        this.sessionStorageService.setItem('takeImageCount', this.takeImage.toString());

      });
  }
  onScroll(index: number) {
    // console.log('scroll index: ', index, this.takeImage);
   

    if (index + this.takeImage > this.images.length) {
      this.makeWhereConditionService.scrollObservable.next({
        skip: this.images.length,
        take: this.takeImage,
      });
    }
    index > 1 ? (this.showScrollToTop = true) : (this.showScrollToTop = false);
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
