import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { AuthService } from 'src/app/auth/keycloak/auth.service';
import { UserProfileComponent } from 'src/app/core/components/user-profile/user-profile.component';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { ProfileMenuModule } from './profile-menu.module';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/modules/dashboard/components/login/services/auth.service';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  imports: [
CommonModule,
    MatDialogModule,
    ProfileMenuModule,
    MatSnackBarModule
  ],
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styles: [`
    .z_index{
      z-index:100;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent implements OnInit {
  dropdown = false;
  userName: string;
  userEmail: string;

  constructor(private authService: AuthService,
    private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private router: Router

    )
    {}

  ngOnInit(): void {
    setTimeout(() => {
      const profile: any = this.sessionStorageService.getItem('userProfile')
      if (profile) {
        this.userName = profile.username;
        this.userEmail = profile.email;
        // console.log('profile-menu. profile', profile);
      }
    }, 1000);

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
    const profile = this.sessionStorageService.getItem('userProfile');
    if (!profile) {
      this.snackBar.open('Please login first', 'Close', {
        duration: 2000,
      });
      return
    }

    const dialogRef = this.dialog.open(UserProfileComponent, {
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('The dialog was closed');
      this.toggleDropdown();
    });
  }
  login() {
    this.router.navigate(['/login']);
    this.toggleDropdown();
  }
  logout() {
    this.authService.logout();
    this.toggleDropdown();
  }
  // Profile dropdown

}
