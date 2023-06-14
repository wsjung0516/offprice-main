import {
  AfterViewInit,
  Component,
  OnInit,
  AfterContentInit,
  HostListener,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserFeedbackComponent } from '../core/components/user-feedback/user-feedback.component';
import { UserService } from 'src/app/user/user.service';
import { CartItemsService } from '../core/components/cart-items/cart-items.service';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { AuthService } from '../core/auth/login/services/auth.service';
import { UserTokenService } from '../core/services/user-token.service';
import { DialogService } from '@ngneat/dialog';
import { StartMenuComponent } from '../core/components/start-menu/start-menu.component';
import { SessionStorageService } from '../core/services/session-storage.service';
import { Meta, Title } from '@angular/platform-browser';
import { FeedbackButtonComponent } from '../core/components/feedback-button/feedback-button.component';
@UntilDestroy()
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserFeedbackComponent,
    StartMenuComponent,
    FeedbackButtonComponent,
  ],
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent implements OnInit, AfterViewInit {
  title = 'angular-app';
  isLoading = false;
  name: string;
  loggedUser: any;
  private logoutTimer: any;
  isRegisterButton = false;
  constructor(
    private userService: UserService,
    private cartItemsService: CartItemsService,
    private cd: ChangeDetectorRef,
    private sharedMenuObservableService: SharedMenuObservableService,
    private router: Router,
    private auth: AngularFireAuth,
    private authService: AuthService,
    private userTokenService: UserTokenService,
    private dialogService: DialogService,
    private sessionStorageService: SessionStorageService,
    private titleService: Title,
    private metaTagService: Meta
  ) {}
  async ngOnInit() {
    // this.loggedUser = this.sessionStorageService.getItem('token');
    this.metaTagService.updateTag(
      {
        name: 'description',
        content: 'offPrice.store is an online wholesale marketplace that sells clothes in bulk at low prices. Customers can easily and quickly search for and purchase products.',
      },
    );
    // console.log('AppComponent ngOnInit -1');
    this.userTokenService.getUserToken().subscribe((loggedUser: any) => {
      // console.log('AppComponent ngOnInit', loggedUser);
      if (loggedUser) {
        this.name = loggedUser.user?.displayName;
        this.loggedUser = loggedUser;
        this.userService.saveUserProfileToDB(this.loggedUser);
        this.cartItemsService.makeUserCart(this.loggedUser.user.uid);
      }
    });

    this.resetLogoutTimer();
    // this.sharedMenuObservableService.closeFeedback$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((close) => {
    //     const dialogOverlay = document.getElementById('dialog-overlay');
    //     dialogOverlay.style.display = 'none';
    //   });
    // this.receiveFeedback();
  }
  // 
  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  resetLogoutTimer() {
    clearTimeout(this.logoutTimer);
    this.logoutTimer = setTimeout(() => {
      const userId = this.sessionStorageService.getItem('userId');
      if( userId ) {
      this.auth.signOut().then(() => {
          this.authService.logout();
          alert('You have been logged out after 30 minutes of inactivity.');
        });
      }
    }, 30 * 60 * 1000); // 30분
  }
  ngAfterViewInit() {
    this.titleService.setTitle('offPrice');
    const title = this.titleService.getTitle();
    // console.log('offPrice-main-title', title);
    // Check if register button can be displayed
    // To prevent from showing register button in child page
    const userId = this.sessionStorageService.getItem('userId');
    if (userId) return;
  }

}
