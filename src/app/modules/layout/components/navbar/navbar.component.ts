import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
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
import { CartItemsService } from 'src/app/core/components/cart-items/cart-items.service';
import { UserTokenService } from 'src/app/core/services/user-token.service';
import { switchMap, tap, Subscription, interval } from 'rxjs';
import { UserService } from 'src/app/user/user.service';
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
  cart_badge_count = '0';
  userName: string;
  newWindow: any;
  subscription: Subscription
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
    private sessionStorageService: SessionStorageService,
    private cartItemsService: CartItemsService,
    private userTokenService: UserTokenService,
    private userService: UserService
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
        // Check every minute (60000 milliseconds)
        
    // this.subscription = interval(180000).subscribe(() => {
    //       // your window checking logic here
    //       console.log('Checking window status...');
    //       // if (newWindow && newWindow.closed) { ... }
    //     if (this.newWindow && this.newWindow.closed) {
    //         console.log('The window has been closed.');
    //         this.sessionStorageService.removeItem('isRegisterLoggedIn');
    //         localStorage.removeItem('isStartMenuPassed');
    //         // this.subscription.unsubscribe();
    //         // this.newWindow = null;
    //     } else {
    //         console.log('The window is still open.');
    //     }
    //   });  
  }
  profile: any;
  ngAfterViewInit(): void {
    // const profile: any = this.sessionStorageService.getItem('token');
    this.userTokenService.getUserToken().subscribe((profile: any) => {
      if (profile) {
        this.userName = profile.user.displayName;
        this.cartItemsService.setCartItemsLength(profile.user.uid ?? '');
        this.profile = profile;
      } else {
        this.userName = 'Guest';
      }
    });
    // To make condition for showing name and cart badge count.
    this.sharedMenuObservableService.isLoggedIn$.pipe(
      tap((isLoggedIn: any) => {
      }),
      untilDestroyed(this),
      switchMap((user_id:string) => {
        return this.userService.getUser(user_id);
      })).subscribe((profile: any) => {
        console.log('isLoggedIn - profile', profile);
        if (profile) {
          this.userName = profile.first_name;
          this.cartItemsService.setCartItemsLength(profile.user_id);
          this.profile = profile;
        } else {
          this.userName = 'Guest';
        }
        this.cd.detectChanges();
      });
    // this.userName = profile?.user.displayName ?? 'Guest';
    this.sharedMenuObservableService.displayName$
      .pipe(untilDestroyed(this))
      .subscribe((name) => {
        this.userName = name;
        this.cd.detectChanges();
      });
      //
    this.sharedMenuObservableService.cart_badge_count$
      .pipe(untilDestroyed(this))
      .subscribe((val) => {
        // console.log('cart_badge_count', val);
        this.cart_badge_count = val;
        this.cd.detectChanges();
      });
    this.sharedMenuObservableService.refreshCartItemsButton$
      .pipe(untilDestroyed(this))
      .subscribe((val) => {
        // console.log('refreshCartItemsButton', val);
        // To display the cart items in the cart dialog.
        this.cartItemsService
          .getCartItemsLength(this.profile?.user.uid ?? '')
          .pipe(untilDestroyed(this))
          .subscribe((val) => {
            // To prevent from displaying when the cart is empty.
            if (val > 0) this.refreshButton.nativeElement.click();
          });
      });
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
  onRegister() {
    // window.open('http://googl.com', '_blank', options);
    this.newWindow = window.open('/register-home');
    window.focus();
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
  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
