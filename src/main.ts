
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
// import { provideClientHydration } from '@angular/platform-browser';

bootstrapApplication(AppComponent, appConfig)
.catch((err:any) => console.error(err));
