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
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
  CommonModule,
    LoaderComponent,
    RouterModule,
    MatProgressBarModule,
    HomeComponent
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
     public themeService: ThemeService) {
    console.log('AppComponent constructor');
  }
  async ngOnInit() {
    console.log('AppComponent ngOnInit');
    this.refreshKeycloakToken();
    this.isLoggedIn = await this.keycloakService.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloakService.loadUserProfile();
      console.log('userProfile', this.userProfile);
      this.name = this.userProfile.firstName;
      if( this.userProfile.id ) {
        this.userService.saveUserProfileToDB(this.userProfile);
      }
    }

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
