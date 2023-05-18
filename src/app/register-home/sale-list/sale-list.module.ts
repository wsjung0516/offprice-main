import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageDetailDirective } from '../core/directives/image-detail.directive';
import { ImageZoomComponent } from '../core/components/image-zoom/image-zoom.component';
import { DescriptionDetailDirective } from '../core/directives/description-detail.directive';
// import { ChipListComponent } from './chip-list/chip-list.component';


@NgModule({
  declarations: [
    ImageZoomComponent,
    ImageDetailDirective,
    DescriptionDetailDirective
    // ChipListComponent
  ],
  imports: [
CommonModule,
    // MatDialogModule
  ],
  exports: [
    ImageZoomComponent,
    ImageDetailDirective,
    DescriptionDetailDirective
  ]
})
export class SaleListModule { }
