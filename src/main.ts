import { enableProdMode, ErrorHandler, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/routes';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from './app/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderInterceptor } from './app/core/interceptors/loader.interceptor';
import { HttpErrorInterceptor } from './app/core/interceptors/http-error.interceptor';
import { GlobalErrorHandler } from './app/core/services/global-error-handler';  
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthModule } from './app/auth/keycloak/auth.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';

class NoReuseStrategy implements RouteReuseStrategy {
  shouldDetach(): boolean {
    return false;
  }

  store(): void {}

  shouldAttach(): boolean {
    return false;
  }

  retrieve(): null {
    return null;
  }

  shouldReuseRoute(): boolean {
    return false;
  }
}
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      MatSnackBarModule,
      AuthModule,
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
   },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
   },
   { provide: ErrorHandler, useClass: GlobalErrorHandler },
   { provide: RouteReuseStrategy, useClass: NoReuseStrategy },
   MatSnackBar
  ]
}).catch((err) => console.error(err));

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
