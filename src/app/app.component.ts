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
  ) {}
  async ngOnInit() {
    this.loggedUser = this.sessionStorageService.getItem('token');
    // console.log('AppComponent ngOnInit', this.isLoggedIn, profile);

    if (this.loggedUser?.user) {
      this.name = this.loggedUser?.user?.displayName;
      this.userService.saveUserProfileToDB(this.loggedUser);
      this.cartItemsService.makeUserCart(this.loggedUser.user.uid);
    }
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
  }

  private receiveFeedback() {

    const profile: any = this.sessionStorageService.getItem('token');
    const feedbackButton = document.getElementById('feedback-button');
    feedbackButton.addEventListener('click', () => {
      const profile: any = this.sessionStorageService.getItem('token');
      // console.log('receiveFeedback', profile);
      if (!profile) {
        this.router.navigate(['/login']);
        return
      }
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
