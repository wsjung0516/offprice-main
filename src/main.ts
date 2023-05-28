import {
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/routes';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from './environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderInterceptor } from './app/core/interceptors/loader.interceptor';
import { HttpErrorInterceptor } from './app/core/interceptors/http-error.interceptor';
import { GlobalErrorHandler } from './app/core/services/global-error-handler';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AngularFireModule } from '@angular/fire/compat';
import { provideErrorTailorConfig } from '@ngneat/error-tailor';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { popperVariation, provideTippyConfig, tooltipVariation } from '@ngneat/helipopper';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      MatSnackBarModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularSvgIconModule.forRoot(),
      MatDialogModule

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
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      }
    }),
    provideErrorTailorConfig({
      errors: {
        useValue: {
          required: 'This field is required',
          minlength: ({ requiredLength, actualLength }) => 
                      `Expect ${requiredLength} but got ${actualLength}`,
          invalidAddress: error => `Address isn't valid`
        }
      }
    }),  
    MatSnackBar,
    // MatDialog
  ],
}).catch((err) => console.error(err));

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
