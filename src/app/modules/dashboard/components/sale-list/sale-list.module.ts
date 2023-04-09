import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageDetailDirective } from 'src/app/core/directives/image-detail.directive';
import { ImageZoomComponent } from 'src/app/core/components/image-zoom/image-zoom.component';
import { DescriptionDetailDirective } from 'src/app/core/directives/description-detail.directive';

@NgModule({
  declarations: [
    ImageZoomComponent,
    ImageDetailDirective,
    DescriptionDetailDirective,
    // ChipListComponent
  ],
  imports: [
    CommonModule,

    // MatDialogModule
  ],
  exports: [
    ImageZoomComponent,
    ImageDetailDirective,
    DescriptionDetailDirective,

  ]
})
export class SaleListModule { }
