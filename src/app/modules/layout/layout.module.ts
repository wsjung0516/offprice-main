import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutRoutingModule } from './layout-routing.module';
@NgModule({
  declarations: [
  ],
  imports: [CommonModule, LayoutRoutingModule, HttpClientModule, 
    AngularSvgIconModule.forRoot(), SharedModule],
})
export class LayoutModule {}
