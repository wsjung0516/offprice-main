import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url
      });
    }

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
  }
}

/* import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
    constructor(protected keycloakService: KeycloakService, private router: Router) {
        super(router, keycloakService);
    }

    async isAccessAllowed(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        // Force the suer to log in if currently unauthenticated
        if (!this.authenticated) {
            await this.keycloakService.login({
                // eslint-disable-next-line angular/window-service
                redirectUri: window.location.origin + state.url
            });
        }
        // Get the roles required from the route.
        const requiredRoles = route.data.roles;

        // Allow the user to proceed if no additional roles are required to access the route.
        if (!(requiredRoles instanceof Array) || requiredRoles.length == 0) {
            return true;
        }
        // console.log(' roles, state, route', this.roles, requiredRoles, route)
        if ( !this.roles.includes('ROLE_ADMIN') &&
             !this.roles.includes('ROLE_SENIOR_MANAGER') &&
             !this.roles.includes('ROLE_JUNIOR_MANAGER') &&
             !this.roles.includes('ROLE_SILVER_MEMBER')
            ) {
            this.router.navigate(['/home']).then()
            return false;
        }

        // Allow the user to proceed if all the required roles are present.
        return requiredRoles.every((role) => this.roles.includes(role));
    }
}
 */


