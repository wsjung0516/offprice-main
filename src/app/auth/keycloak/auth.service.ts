import { Injectable } from '@angular/core';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import { from, Observable } from 'rxjs';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private keycloakService: KeycloakService,
    private sessionStorageService: SessionStorageService,
    ) {}

  public getLoggedUser(): KeycloakTokenParsed | undefined {
    try {
      return this.keycloakService.getKeycloakInstance().idTokenParsed;
    } catch (e) {
      console.error('Exception', e);
      return undefined;
    }
  }

  public isLoggedIn(): Observable<boolean> {
    return from(this.keycloakService.isLoggedIn());
  }

  public loadUserProfile(): Observable<KeycloakProfile> {
    return from(this.keycloakService.loadUserProfile());
  }

  async login() {
    const store = this.sessionStorageService.getItem('userProfile');
    console.log('login', store)
    if (!store) {
      await this.keycloakService.login();
    }
  }
  async logout() {
    // eslint-disable-next-line angular/window-service
    const store = this.sessionStorageService.getItem('userProfile');
    const isLogin = await this.keycloakService.isLoggedIn();
    console.log('logout', store)

    if (store) {
      this.sessionStorageService.removeItem('userProfile');
    }
    this.keycloakService.logout(window.location.origin);
  }

  public redirectToProfile(): void {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }

  public getRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }
}
