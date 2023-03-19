import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {}

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

  public login(): void {
    this.keycloakService.login();
  }

  public logout(): void {
    // eslint-disable-next-line angular/window-service
    this.keycloakService.logout(window.location.origin);
  }

  public redirectToProfile(): void {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }

  public getRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }
}
