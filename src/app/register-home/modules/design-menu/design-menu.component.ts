import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DesignCategoryMenuComponent } from '../../core/components/design-category-menu/design-category-menu.component';
import { DesignSizeMenuComponent } from '../../core/components/design-size-menu/design-size-menu.component';

@Component({
  selector: 'app-design-menu',
  standalone: true,
  imports: [
    CommonModule,
    DesignCategoryMenuComponent,
    DesignSizeMenuComponent
  ],
  template: `
  <div class="mt-4 grid grid-col-1 gap-2 sm:grid-cols-2">
    <div class="m-2 p-2 border border-blue-300 rounded-md">
      <app-design-category-menu></app-design-category-menu>
    </div>
    <div class="m-2 p-2 border border-blue-300 rounded-md">
      <app-design-size-menu></app-design-size-menu>
    </div>
  </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignMenuComponent {

}
