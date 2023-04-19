import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from './core/components/loader/loader.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { UserService } from './user/user.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HomeComponent } from './home/home.component';
import { ThemeService } from './core/services/theme.service';
import { SessionStorageService } from './core/services/session-storage.service';
import { CartItemsService } from './core/components/cart-items/cart-items.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
CommonModule,
    LoaderComponent,
    RouterModule,
    MatProgressBarModule,
    HomeComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  title = 'angular-app';
  isLoading = false;
  name: string;
  isLoggedIn: boolean;
  public userProfile: KeycloakProfile | null = null;
  constructor(private keycloakService: KeycloakService,
     private userService: UserService,
     public themeService: ThemeService,
     private sessionStorageService: SessionStorageService,
     private cartItemsService: CartItemsService,
     ) {
  }
  async ngOnInit() {
    this.isLoading = true;
    this.refreshKeycloakToken();
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    const profile:any = this.sessionStorageService.getItem('userProfile');
    // console.log('AppComponent ngOnInit', this.isLoggedIn, profile);

    if (this.isLoggedIn) {
      this.isLoading = false;
      this.userProfile = await this.keycloakService.loadUserProfile();
      this.name = this.userProfile.firstName;
      if( this.userProfile.id ) {
        this.sessionStorageService.setItem('userProfile', this.userProfile);
        this.userService.saveUserProfileToDB(this.userProfile);
        // This is for the case when the user is log in.
        this.cartItemsService.setCartItemsLength(this.userProfile.id);
        this.cartItemsService.makeUserCart(this.userProfile.id);
      }
      
    }
    if( profile ) { // This is for the case when the page is refreshed without log out.
      this.cartItemsService.setCartItemsLength(profile.id);
      this.cartItemsService.makeUserCart(profile.id);
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 10000);

  }
  refreshKeycloakToken() {
    this.keycloakService.keycloakEvents$.subscribe({
      next: (e: any) => {
        this.isLoading = false
        console.log('keycloakEvents$', e);

        if (e.type == KeycloakEventType.OnTokenExpired) {
          this.keycloakService.updateToken(20);
        }
      }
    });  }
  login() {
    // this.oauthService.initCodeFlow();
    this.isLoading = true;
    this.keycloakService.login();
  }
  logout() {
    this.keycloakService.logout();
  }
}
