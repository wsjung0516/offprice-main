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
import { UserService } from 'src/app/user/user.service';
import { ClickOutsideDirective } from 'src/app/core/directives/click-outside.directive';
import { AboutComponent } from 'src/app/core/components/about/about.component';
import { SEOService } from 'src/app/core/services/SEO.service';
@Component({
  standalone: true,
  imports: [
  CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    ClickOutsideDirective,
  ],
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
    private userService: UserService,
    private sEOService: SEOService,
  ) {}

  ngOnInit(): void {}
  initials = '';
  ngAfterViewInit(): void {
    const userId: any = this.sessionStorageService.getItem('userId');
    if (userId) {
      this.isLoggedIn = true;
      this.userService.getUser(userId.user_id).subscribe((user: any) => {
        this.userName = user.first_name;
        this.userEmail = user.email;
        const names = [user.first_name, user.last_name];
        if( names[0] && names[1]) {
          this.initials =
            names[0].substring(0, 1).toUpperCase() +
            names[names.length - 1].substring(0, 1).toUpperCase();
          this.cd.detectChanges();
        }
      });
      // console.log('profile-menu. profile', profile);
    } else {
      this.isLoggedIn = false;
      this.initials = 'Guest';
      this.cd.detectChanges();
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
  onManual() {
    window.open('/help', '_blank');
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
  openAbout() {
    // this.router.navigate(['/about']);
    this.dialog.open(AboutComponent,{
    });
    this.toggleDropdown();
  }
  login() {
    this.router.navigate(['/login']);
    this.toggleDropdown();
  }
  logout() {
    this.registerAuthService.logout();
    this.toggleDropdown();
    this.isLoggedIn = false;
  }
  // Profile dropdown
}
