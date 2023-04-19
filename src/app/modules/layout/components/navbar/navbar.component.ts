import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MenuService } from '../../../../core/services/menu.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobilecomponent';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router, RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { RemoveChipsKeywordService } from 'src/app/core/services/remove-chips-keyword.service';
import { MakeTableWhereConditionService } from 'src/app/core/services/make-table-where-condition.service';
import { DialogService } from '@ngneat/dialog';
import { CartItemsComponent } from 'src/app/core/components/cart-items/cart-items.component';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    NavbarMenuComponent,
    NavbarMobileComponent,
    ProfileMenuComponent,
    MatIconModule,
    RouterModule,
    MatBadgeModule,
    CartItemsComponent,
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  sSize: string;
  cart_badge_count = '0';
  userName: string;
  @ViewChild('refreshButton', { static: false }) refreshButton: ElementRef;
  // public screenSize$: Observable<any>;
  constructor(
    private menuService: MenuService,
    private screenSizeService: ScreenSizeService,
    private sharedMenuObservableService: SharedMenuObservableService,
    private removeChipsKeywordService: RemoveChipsKeywordService,
    private makeTableWhereConditionService: MakeTableWhereConditionService,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.screenSizeService.screenSize$
      .pipe(untilDestroyed(this))
      .subscribe((size) => {
        // console.log('size', size)
        this.sSize = size;
        this.cd.detectChanges();
      });
    this.sharedMenuObservableService.gotoHome$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.gotoHome();
      });
    this.sharedMenuObservableService.cart_badge_count$
      .pipe(untilDestroyed(this))
      .subscribe((val) => {
        this.cart_badge_count = val;
        this.cd.detectChanges();
      });
    this.sharedMenuObservableService.refreshCartItemsButton$
      .pipe(untilDestroyed(this))
      .subscribe((val) => {
        console.log('refreshCartItemsButton', val);
        this.refreshButton.nativeElement.click();
      })
      const profile:any = this.sessionStorageService.getItem('userProfile');

      this.userName = profile?.username ?? 'Guest';
  }

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }
  gotoHome() {
    // To reset the search keyword and positioned selection button to the 'All'.
    this.resetKeyword();
    this.makeTableWhereConditionService.resetSort();
  }
  openCart() {
    this.dialogService.open(CartItemsComponent, {
      // width: '800px'
    });
  }
  resetKeyword() {
    const service = this.sharedMenuObservableService;
    const filters: any[] = [
      //   { name: 'vendor', subject: service.vendor, defaultValue: 'All' },
      {
        reset: service.reset_input_keyword,
        name: 'input_keyword',
        subject: service.input_keyword,
        defaultValue: '',
      },
      {
        reset: service.reset_price,
        name: 'price',
        subject: service.price,
        defaultValue: 'All',
      },
      {
        reset: service.reset_category,
        name: 'category',
        subject: service.category,
        defaultValue: 'All',
      },
      {
        reset: service.reset_size,
        name: 'size',
        subject: service.size,
        defaultValue: 'All',
      },
      {
        reset: service.reset_material,
        name: 'material',
        subject: service.material,
        defaultValue: 'All',
      },
      {
        reset: service.reset_search_period,
        name: 'search_period',
        subject: service.search_period,
        defaultValue: 'All',
      },
    ];
    filters.forEach((filter) => {
      const { subject, defaultValue, name } = filter;
      // console.log('subject', subject.value, name)
      if (subject.value !== defaultValue) {
        filter.reset.next({});
        this.removeChipsKeywordService.resetSearchKeyword({
          key: name,
          value: '',
        });
      }
    });
  }
}
