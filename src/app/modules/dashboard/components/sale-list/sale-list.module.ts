import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageDetailDirective } from 'src/app/core/directives/image-detail.directive';
import { ImageZoomComponent } from 'src/app/core/components/image-zoom/image-zoom.component';


@NgModule({
  declarations: [
    ImageZoomComponent,
    ImageDetailDirective,
    // ChipListComponent
  ],
  imports: [
  CommonModule,
    // MatDialogModule
  ],
  exports: [
    ImageZoomComponent,
    ImageDetailDirective
  ]
})
export class SaleListModule { }
