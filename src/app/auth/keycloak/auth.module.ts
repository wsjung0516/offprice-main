import { APP_INITIALIZER, NgModule } from '@angular/core';
// import { AuthGuard } from '@app/core/keycloak/auth.guard';
// import { AuthService } from '@app/core/keycloak/auth.service';
// import { initializeKeycloak } from '@app/core/keycloak/keycloak-initializer';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import {initializeKeycloak} from './keycloak-initializer';
import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';

@NgModule({
  declarations: [],
  imports: [KeycloakAngularModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    AuthGuard,
    AuthService
  ]
})
export class AuthModule {}
