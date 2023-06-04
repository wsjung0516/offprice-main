import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Categories1, Category } from 'src/app/core/constants/data-define';

@Component({
  selector: 'app-category1-vca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-200 px-1 py-1 flex items-center">
      <div class="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div class="inline-flex" [style.margin-left.px]="scrollOffset">
          <ng-container *ngFor="let button of categories">
            <button
              mat-button-toggle
              class="border border-transparent rounded-full mx-1 text-gray-500 hover:text-gray-800 focus:outline-none focus:border-blue-500 active:text-blue-500 button-group"
              [ngClass]="{ selected: selected_category.id === button.id }"
              [value]="button"
              (click)="selectValue(button)"
            >
              <span class="text-sm">{{ button.key }}</span>
            </button>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .button-group {
        border: 1px solid #ccc;
        padding: 1px 6px;
        background-color: #fff;
        color: #333;
        font-size: 8px;
      }

      .button-group.selected {
        background-color: green;
        color: #fff;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }

      /* For IE, Edge and Firefox */
      .scrollbar-hide {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: Category1VcaComponent,
      multi: true,
    },
  ],
})
export class Category1VcaComponent implements ControlValueAccessor {
  @Input() set category1(value: Category) {
    this.selected_category = value;
  }
  constructor() {}
  scrollOffset = 0;
  onChange: any = () => {};
  onTouch: any = () => {};
  categories = Categories1;
  selected_category: Category;

  selectValue(category: Category) {
    this.selected_category = category;
    // console.log('category1-vca.component.ts: category: ', category);
    this.onChange(this.selected_category);
  }
  writeValue(value: any): void {
    // this.categories = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
