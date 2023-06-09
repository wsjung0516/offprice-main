import { Component, ElementRef, Input, ChangeDetectorRef, AfterViewInit, OnInit, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
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
          [ngClass]="{ sel_class: category.key === selected_category, group1: category.group === '1', group2: category.group === '2' }"
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
      .group1 {
        border: 2px solid #ef4444;
      }
      .group2 {
        border: 2px solid #84cc16;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryVcaComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges {
  @Input() categories: any[];
  @Input() selected_category_data: string;
  @Input() set reset_category(value: boolean) {
    if( value) {
      this.selected_category = '';
    }    
  }
  constructor(private elRef: ElementRef,
    private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    // console.log('ngOnInit: ', this.category_list);
  }
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit: ', this.category_list, this.categories);
    this.category_list = [...this.categories];
    if (this.selected_category_data) {
      this.selected_category = this.selected_category_data;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges: ', changes);
    if(changes['selected_category_data'] && changes['selected_category_data'].currentValue) {
      this.selected_category = changes['selected_category_data'].currentValue;
      this.onChange(this.selected_category);
    }
    if( changes['categories'] && changes['categories'].currentValue) {
      this.category_list = [...this.categories];
    }
  }
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
