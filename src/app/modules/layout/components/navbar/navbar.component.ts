import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  effect,
  computed,
  inject,
} from '@angular/core';
import { MenuService } from '../../../../core/services/menu.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobilecomponent';
import { ProfileMenuComponent } from '../../../../core/components/profile-menu/profile-menu.component';
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
import { CartItemsService } from 'src/app/core/components/cart-items/cart-items.service';
import { UserTokenService } from 'src/app/core/services/user-token.service';
import { switchMap, tap, Subscription, interval, Observable, of } from 'rxjs';
import { UserService } from 'src/app/user/user.service';
import { Meta, Title } from '@angular/platform-browser';
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
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  sSize: string;
  // cart_badge_count = '0';
  cart_badge_count = computed(() => this.cartItemsService.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  // userName: string;
  newWindow: any;
  subscription: Subscription;
  @ViewChild('openCartButton', { static: false }) refreshButton: ElementRef;
  // public screenSize$: Observable<any>;
  constructor(
    private menuService: MenuService,
    private screenSizeService: ScreenSizeService,
    public sharedMenuObservableService: SharedMenuObservableService,
    private removeChipsKeywordService: RemoveChipsKeywordService,
    private makeTableWhereConditionService: MakeTableWhereConditionService,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private sessionStorageService: SessionStorageService,
    private cartItemsService: CartItemsService,
    private userTokenService: UserTokenService,
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {
    effect(() => {
      if( sharedMenuObservableService.refreshCartItemsButton()) {
        if ( this.cartItemsService.subPrice() > 0) this.refreshButton.nativeElement.click();
        this.sharedMenuObservableService.refreshCartItemsButton.set(false);
      }
    }, {allowSignalWrites: true})
  }
  showSideBar = this.menuService.showSideBar; // menu.service.ts, showSideBar = signal<boolean>(true);

  ngOnInit(): void {
    this.screenSizeService.screenSize$
      .pipe(untilDestroyed(this))
      .subscribe((size) => {
        // console.log('size', size)
        this.sSize = size;
        this.cd.detectChanges();
      });
    this.sharedMenuObservableService.resetSearchConditions$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        // console.log('resetSearchConditions is called');
        this.resetSearchConditions();
      });
  }
  profile: any;
  ngAfterViewInit(): void {
  }
  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu.set(true);
  }
  resetSearchConditions() {
    // To reset the search keyword and positioned selection button to the 'All'.
    // 
    this.resetKeyword();
    this.makeTableWhereConditionService.resetSort();
    this.makeTableWhereConditionService.refreshObservable.next('');
  }
  openCart() {
    this.dialogService.open(CartItemsComponent, {
      // width: auto
    });
  }
  onRegister() {
    this.titleService.setTitle('off price wholesale marketplace');
    this.sessionStorageService.setItem('title', 'Register');

    this.router.navigate(['/register-home']);
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
        reset: service.reset_color,
        name: 'color',
        subject: service.color,
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
  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
