import {
  AfterViewInit,
  Component,
  OnInit,
  AfterContentInit,
  HostListener,
} from '@angular/core';
import { LoaderComponent } from './core/components/loader/loader.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from './user/user.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HomeComponent } from './home/home.component';
import { ThemeService } from './core/services/theme.service';
import { SessionStorageService } from './core/services/session-storage.service';
import { CartItemsService } from './core/components/cart-items/cart-items.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChangeDetectorRef } from '@angular/core';
import { SharedMenuObservableService } from './core/services/shared-menu-observable.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FeedbackRequestComponent } from './feedback-request/feedback-request.component';
import { AuthService } from './modules/dashboard/components/login/services/auth.service';
import { UserTokenService } from './core/services/user-token.service';
import { filter, switchMap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
  CommonModule,
    LoaderComponent,
    RouterModule,
    MatProgressBarModule,
    HomeComponent,
    MatProgressSpinnerModule,
    FeedbackRequestComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'angular-app';
  isLoading = false;
  name: string;
  loggedUser: any;
  private logoutTimer: any;
  isRegisterButton = false;
  
  constructor(
    private userService: UserService,
    public themeService: ThemeService,
    private sessionStorageService: SessionStorageService,
    private cartItemsService: CartItemsService,
    private cd: ChangeDetectorRef,
    private sharedMenuObservableService: SharedMenuObservableService,
    private router: Router,
    private auth: AngularFireAuth,
    private authService: AuthService,
    private userTokenService: UserTokenService,
  ) {}
  async ngOnInit() {
    // this.loggedUser = this.sessionStorageService.getItem('token');
    console.log('AppComponent ngOnInit -1');
    this.userTokenService.getUserToken().subscribe((loggedUser: any) => {
      console.log('AppComponent ngOnInit', loggedUser);
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
    // Check if register button can be displayed
    console.log('AppComponent ngAfterViewInit');
    this.userTokenService.getUserToken().pipe(
      filter((profile: any) => profile !== null),
      switchMap((profile: any) => {
        return this.userService.getUser(profile.user.uid);
      })
    ).subscribe((userProfile: any) => {
      // console.log('userProfile', userProfile);
      if( userProfile.seller === true ) {
        this.isRegisterButton = true;
        this.sharedMenuObservableService.closeRegisterButton.next(true);
      }
    });
    // To make condition for showing register button in home page when user is logged in
    this.sharedMenuObservableService.isLoggedIn$.pipe(
      untilDestroyed(this),
      switchMap((user_id:string) => {
        return this.userService.getUser(user_id);
      })).subscribe((userProfile: any) => {
        // console.log('userProfile', userProfile);
        if( userProfile.seller === true ) {
          this.isRegisterButton = true;
          this.sharedMenuObservableService.closeRegisterButton.next(true);
        }
      });
      // To show register button in home page when user is logged in
    this.sharedMenuObservableService.closeRegisterButton$.pipe(
      untilDestroyed(this)
      ).subscribe((status) => {
        this.isRegisterButton = status;
      });
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
  onRegister() {
    if (window.opener) {
      // 이 창은 부모 창에 의해 열렸습니다.
      // this.isNewWindow = true;
      console.log('This window was opened by another window.');
    } else {
      // 이 창은 부모 창에 의해 열리지 않았습니다.
      console.log('This window was not opened by another window.');
    }
    const width = window.screen.width;
    const height = window.screen.height;
    const options =
      'resizable=1, scrollbars=1, fullscreen=0, ' +
      'width=' + width + ', height=' +  height + ',' +
      'screenX=100 , left=100, screenY=0, top=0, v-toolbar=0, menubar=0, status=0';

    // window.open('http://googl.com', '_blank', options);
    window.open('/register-home');
    // window.open('/about', 'offPrice Register', options);
    window.focus();
  }
  acitveTab = 'tab1';
  setActiveTab(tabId: string) {
    this.acitveTab = tabId;
  }
  isActiveTab(tabId: string) {
    return this.acitveTab === tabId;
  }
  
}
