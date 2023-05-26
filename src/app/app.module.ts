import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { UserFeedbackComponent } from './core/components/user-feedback/user-feedback.component';

@NgModule({
  declarations: [
  
  
    UserFeedbackComponent
  ],
  imports: [
    AppComponent,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  // bootstrap: [AppComponent]
})
export class AppModule { }
