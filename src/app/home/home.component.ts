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
import { FeedbackRequestComponent } from '../feedback-request/feedback-request.component';
import { UserService } from '../user/user.service';
import { CartItemsService } from '../core/components/cart-items/cart-items.service';
import { SharedMenuObservableService } from '../core/services/shared-menu-observable.service';
import { AuthService } from '../modules/dashboard/components/login/services/auth.service';
import { UserTokenService } from '../core/services/user-token.service';
import { DialogService } from '@ngneat/dialog';
import { StartMenuComponent } from '../core/components/start-menu/start-menu.component';
import { SessionStorageService } from '../core/services/session-storage.service';
import { Title } from '@angular/platform-browser';
@UntilDestroy()
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
  CommonModule,
      RouterModule,
      FeedbackRequestComponent,
      StartMenuComponent
    ],  templateUrl: './home.component.html',
  styles: [
  ]
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
    private titleService: Title
  ) {}
  async ngOnInit() {
    // this.loggedUser = this.sessionStorageService.getItem('token');
    console.log('AppComponent ngOnInit -1');
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
    this.sharedMenuObservableService.closeFeedback$.pipe(untilDestroyed(this))
    .subscribe((close) => {
      const dialogOverlay = document.getElementById('dialog-overlay');
      dialogOverlay.style.display = 'none';   
    })
    this.receiveFeedback();

  }
  // Logout after 30 minutes of inactivity
  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  resetLogoutTimer() {
    clearTimeout(this.logoutTimer);
    this.logoutTimer = setTimeout(() => {
      this.auth.signOut().then(() => {
        this.authService.logout();
        alert('You have been logged out after 30 minutes of inactivity.');
      });
    }, 30 * 60 * 1000); // 30분
  }
  ngAfterViewInit() {
    const title = this.titleService.getTitle();
    console.log('offPrice-main-title', title);
    // Check if register button can be displayed
    console.log('AppComponent ngAfterViewInit');
    // To prevent from showing register button in child page
    // const isStartMenuPassed = localStorage.getItem('isStartMenuPassed');
    const userId = this.sessionStorageService.getItem('userId');
    if ( userId ) return;
    if( title === 'OffpriceMain' ) {
      const ref = this.dialogService.open(StartMenuComponent, {
        width: '340px',
        backdrop: false,
        enableClose: false,
        closeButton: false,
      });
      ref.afterClosed$.subscribe((result) => {
        if (result) {
          console.log('ref.afterClosed$.subscribe', result)
          // localStorage.setItem('isStartMenuPassed', 'true');
          this.isRegisterButton = true;
          this.cd.detectChanges();
        }
      })
    }
  }

  private receiveFeedback() {

    const feedbackButton = document.getElementById('feedback-button');
    feedbackButton.addEventListener('click', () => {
      this.userTokenService.getUserToken().subscribe((loggedUser: any) => {
        if (!loggedUser) {
          this.router.navigate(['/login']);
          return
        }
      });
  
      const dialogOverlay = document.getElementById('dialog-overlay');
      dialogOverlay.style.display =
        dialogOverlay.style.display === 'none' ? 'flex' : 'none';

      const closeButton = document.getElementById('close-btn');
      closeButton.addEventListener('click', () => {
        dialogOverlay.style.display = 'none';
      });

    });
  
  }
  acitveTab = 'tab1';
  setActiveTab(tabId: string) {
    this.acitveTab = tabId;
  }
  isActiveTab(tabId: string) {
    return this.acitveTab === tabId;
  }
  
}
