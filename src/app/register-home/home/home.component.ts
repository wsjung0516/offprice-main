import {
  Component,
  AfterViewInit,
  ChangeDetectorRef,
  OnInit,
  HostListener,
} from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { Router, RouterModule } from '@angular/router';
import { SaleListComponent } from '../sale-list/sale-list.component';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RemoveChipsKeywordService } from 'src/app/core/services/remove-chips-keyword.service';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
// import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { RegisterAuthService } from '../auth/login/services/register-auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { HelpComponent } from '../core/components/help/help.component';
import { UserTokenService } from 'src/app/core/services/user-token.service';
import { UserProfileComponent } from 'src/app/core/components/user-profile/user-profile.component';
import { LoaderComponent } from 'src/app/core/components/loader/loader.component';
import { ClickOutsideDirective } from 'src/app/core/directives/click-outside.directive';
import { DialogService } from '@ngneat/dialog';
import { BuyCouponsComponent } from '../core/components/buy-coupons/buy-coupons.component';
import { FeedbackButtonComponent } from 'src/app/core/components/feedback-button/feedback-button.component';
import { RegisterProfileMenuComponent } from '../core/components/profile-menu/register-profile-menu.component';
import { Meta, Title } from '@angular/platform-browser';

// import { LoginModule } from '../login/login.module';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CommonModule,
    RegisterComponent,
    SaleListComponent,
    RouterModule,
    MatDialogModule,
    UserProfileComponent,
    // HomeModule,
    MatIconModule,
    HelpComponent,
    LoaderComponent,
    ClickOutsideDirective,
    BuyCouponsComponent,
    FeedbackButtonComponent,
    RegisterProfileMenuComponent,
    // LoginModule,
  ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  userName = '';
  userEmail = '';
  private logoutTimer: any;
  isProfileMenuOpen = false;
  userCoupons = '';
  constructor(
    public dialog: MatDialog,
    private sharedMenuObservableService: SharedMenuObservableService,
    private authService: RegisterAuthService,
    private auth: AngularFireAuth,
    private cd: ChangeDetectorRef,
    private sessionStorageService: SessionStorageService,
    private userTokenService: UserTokenService,
    private dialogService: DialogService,
    private titleService: Title,
    private metaTagService: Meta,
    private router: Router
  ) {}
  ngOnInit() {
    // console.log('Register HomeComponent ngOnInit');
    this.metaTagService.updateTag(
      {
        name: 'description',
        content: 'offPrice.store is an online wholesale marketplace that sells clothes in bulk at low prices. Customers can easily and quickly search for and purchase products.',
      },
    );
    this.titleService.setTitle('offprice main page')
    this.resetLogoutTimer();
    this.sharedMenuObservableService.closeFeedback$
      .pipe(untilDestroyed(this))
      .subscribe((close) => {
        //const dialogOverlay = document.getElementById('dialog-overlay');
        // dialogOverlay.style.display = 'none';
      });
    this.receiveFeedback();
  }
  // Logout after 60 minutes of inactivity
  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  resetLogoutTimer() {
    clearTimeout(this.logoutTimer);
    this.logoutTimer = setTimeout(() => {
      const userId = this.sessionStorageService.getItem('userId');
      if( userId ) {
      this.auth.signOut().then(() => {
          this.authService.logout();
          alert('You have been logged out after 60 minutes of inactivity.');
        });
      }
    }, 60 * 60 * 1000); // 30분
  }
  ngAfterViewInit() {
    //
    this.titleService.setTitle('Register');
    this.sessionStorageService.setItem('title','Register');

    this.sharedMenuObservableService.userCoupons$.subscribe((coupon) => {
      if (coupon) {
        console.log('userCoupons', coupon);
        this.userCoupons = coupon;
        this.cd.detectChanges();
      }
    });
    this.userTokenService.getUserToken().subscribe((profile: any) => {
      if (profile) {
        this.userName = profile?.user.displayName;
        this.cd.detectChanges();
      }
    });
    // this.sharedMenuObservableService.displayName$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((name) => {
    //     this.userName = name;
    //     this.cd.detectChanges();
    //   });
    this.sharedMenuObservableService.isProfileMenuOpen$
      .pipe(untilDestroyed(this))
      .subscribe((isOpen) => {
        this.isProfileMenuOpen = isOpen;
        this.cd.detectChanges();
      });
  }

  dropdown = false;
  private receiveFeedback() {
    // const feedbackButton = document.getElementById('feedback-button');
    // feedbackButton.addEventListener('click', () => {
    //   this.userTokenService.getUserToken().subscribe((profile: any) => {
    //     if (!profile) {
    //       return;
    //     }
    //   });
    //   const dialogOverlay = document.getElementById('dialog-overlay');
    //   dialogOverlay.style.display =
    //     dialogOverlay.style.display === 'none' ? 'flex' : 'none';

    //   const closeButton = document.getElementById('close-btn');
    //   closeButton.addEventListener('click', () => {
    //     dialogOverlay.style.display = 'none';
    //   });
    // });
  }

  toggleDropdown() {
    this.dropdown = !this.dropdown;
  }
  mobile_menu = true;
  mobileMenuOpen() {
    this.mobile_menu = !this.mobile_menu;
    // document.getElementById('mobile-menu').classList.toggle('show');
  }
  openProfile() {
    const dialogRef = this.dialog.open(UserProfileComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.toggleDropdown();
    });
  }
  openBuyCoupons() {
    const dialogRef = this.dialogService.open(BuyCouponsComponent, {
      width: '300px',
      height: '500px',
    });
  }
  logout() {
    this.authService.logout();
  }
  onGotoShopping() {
    // To reset the search keyword and positioned selection button to the 'All'.
    // this.resetKeyword();
    this.router.navigate(['/']);
  }
}
