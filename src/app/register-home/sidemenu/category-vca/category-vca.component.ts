import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Categories, Product } from 'src/app/core/constants/data-define';

@Component({
  selector: 'app-category-vca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex_wrap">
      <ng-container *ngFor="let category of category_list">
        <button
          class="box-size flex items-center justify-center cursor-pointer"
          [ngClass]="{ sel_class: category.key === selected_category }"
          (click)="selectValue(category)"
        >
          {{ category.key }}
        </button>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .flex_wrap {
        display: flex;
        flex-wrap: wrap;
      }
      .box-size {
        width: auto;
        padding: 0.2rem;
        height: 2.0rem;
        margin: 0.2rem;
        border: 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 0.25rem;
      }
      .sel_class {
        background-color: #2962ff;
        color: white;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CategoryVcaComponent,
      multi: true,
    },
  ],
})
export class CategoryVcaComponent implements ControlValueAccessor {
  @Input() set categories(value: any[]) {
    // this.selected_category = value;
    this.category_list = [...value];
  }
  @Input() set selected_category_data(value: string) {
    if( value) {
      this.selected_category = value;
    }
  }
  @Input() set reset_category(value: boolean) {
    if( value) {
      this.selected_category = '';
    }    
  }
  constructor() {}
  onChange: any = () => {};
  onTouch: any = () => {};
  // categories = Categories;
  selected_category = '';
  category_list: Product[] = [];

  selectValue(value: any) {
    // console.log('category: ', value);
    this.selected_category = value.key;
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
