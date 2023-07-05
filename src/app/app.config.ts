import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MatDialogModule } from '@angular/material/dialog';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { GlobalErrorHandler } from './core/services/global-error-handler';
import { popperVariation, provideTippyConfig, tooltipVariation } from '@ngneat/helipopper';
import { provideErrorTailorConfig } from '@ngneat/error-tailor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule } from '@ngxs/store';
import { RegisterState } from './store/register/register.state';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularSvgIconModule.forRoot(),
      MatDialogModule,
      NgxsModule.forRoot([RegisterState]),
      NgxsSelectSnapshotModule.forRoot(),
      NgxsStoragePluginModule.forRoot({key: ['Register']})
  
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
    provideClientHydration(),
    MatSnackBar
  ],
};
