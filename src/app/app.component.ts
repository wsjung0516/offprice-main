import { Component, OnInit } from '@angular/core';
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
  loggedUser: any;
  constructor(
     private userService: UserService,
     public themeService: ThemeService,
     private sessionStorageService: SessionStorageService,
     private cartItemsService: CartItemsService,
     ) {
  }
  async ngOnInit() {
    this.loggedUser = JSON.parse(localStorage.getItem('token'))?.user;
    // console.log('AppComponent ngOnInit', this.isLoggedIn, profile);

    if (this.loggedUser.user) {
      this.name = this.loggedUser?.user?.displayName;
      this.userService.saveUserProfileToDB(this.loggedUser);
      // This is for the case when the user-profile is log in.
      this.cartItemsService.setCartItemsLength(this.loggedUser.user.uid);
      this.cartItemsService.makeUserCart(this.loggedUser.user.uid);
      // if( this.userProfile.id ) {
      // }

    }
    // if( this.loggedUser.user ) { // This is for the case when the page is refreshed without log out.
    //   this.cartItemsService.setCartItemsLength(this.loggedUser.user.uid);
    //   this.cartItemsService.makeUserCart(this.loggedUser.user.uid);
    // }
    setTimeout(() => {
      this.isLoading = false;
    }, 10000);

  }
}
