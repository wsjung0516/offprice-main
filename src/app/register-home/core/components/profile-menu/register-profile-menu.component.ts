import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { AuthService } from 'src/app/auth/keycloak/auth.service';
import { UserProfileComponent } from 'src/app/core/components/user-profile/user-profile.component';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterAuthService } from 'src/app/register-home/auth/login/services/register-auth.service';
import { Router } from '@angular/router';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { UserService } from 'src/app/user/user.service';
import { ClickOutsideDirective } from 'src/app/core/directives/click-outside.directive';
import { Title } from '@angular/platform-browser';
@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSnackBarModule, ClickOutsideDirective],
  selector: 'app-register-profile-menu',
  templateUrl: './register-profile-menu.component.html',
  styles: [
    `
      .z_index {
        z-index: 100;
      }
      a.disabled {
        pointer-events: none;
        color: lightgray;
        cursor: not-allowed;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterProfileMenuComponent implements OnInit, AfterViewInit {
  dropdown = false;
  userName: string;
  userEmail: string;
  isLoggedIn = false;

  constructor(
    private registerAuthService: RegisterAuthService,
    private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private router: Router,
    private sharedMenuObservableService: SharedMenuObservableService,
    private userService: UserService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
  }
  initials = '';
  ngAfterViewInit(): void {
    const userId: any = this.sessionStorageService.getItem('userId');
    if (userId) {
      this.isLoggedIn = true;
      this.userService.getUser(userId.user_id).subscribe((user: any) => {
        this.userName = user.first_name;
        this.userEmail = user.email;
        const names = [user.first_name, user.last_name];
        this.initials = names[0].substring(0, 1).toUpperCase() + names[names.length - 1].substring(0, 1).toUpperCase();
        this.cd.detectChanges();
        
      });
      // console.log('profile-menu. profile', profile);
    }
  }

  // Profile dropdown
  toggleDropdown() {
    this.dropdown = !this.dropdown;
    // document.getElementById('user-profile-menu-button').classList.toggle('show');
  }
  mobile_menu = true;
  mobileMenuOpen() {
    this.mobile_menu = !this.mobile_menu;
    // document.getElementById('mobile-menu').classList.toggle('show');
  }
  openProfile() {
    const userId: any = this.sessionStorageService.getItem('userId');
    if (!userId) {
      this.snackBar.open('Please login first', 'Close', {
        duration: 2000,
      });
      return;
    }

    const dialogRef = this.dialog.open(UserProfileComponent, {});

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
      // To show the register button
      const userId: any = this.sessionStorageService.getItem('userId');

      this.toggleDropdown();
    });
  }
  login() {
    const isRegisterLoggedIn = this.sessionStorageService.getItem('isRegisterLoggedIn');
    if (isRegisterLoggedIn) {
      this.snackBar.open('You are already logged in', 'Close', {
        duration: 2000,
      });
      this.router.navigate(['/']);
      const userId:any = this.sessionStorageService.getItem('userId');
      this.sharedMenuObservableService.isLoggedIn.next(userId.user_id);
    } else {
      this.router.navigate(['/login']);
      this.toggleDropdown();
    }
  }
  logout() {
    this.registerAuthService.logout();
    this.isLoggedIn = false;
    this.toggleDropdown();
  }
  // Profile dropdown
}
