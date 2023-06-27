import {
  Component,
  Input,
  ChangeDetectorRef,
  AfterViewInit,
  OnInit,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Categories, Product } from 'src/app/core/constants/data-define';
import { DesignCategoryMenuService } from '../../core/components/design-category-menu/design-category-menu.service';

@Component({
  selector: 'app-category-vca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <p><span class="text-md text-gray-500">Value: </span>
  <span class="text-blue-600 font-bold">{{selected_category}}</span>
  </p>
    <div class="flex_wrap">
      <ng-container *ngFor="let cat of selectedCategories">
        <button
          class="mt-2 border border-blue-500 rounded-full px-2 mx-1  hover:text-blue-600 focus:outline-none focus:border-blue-500 active:text-blue-500 button-group"
          [value]="cat"
          (click)="selectValue(cat)"
        >
          <div class="flex items-center">
            <span class="text-sm text-gray-400">{{ cat.group }}</span>
            <span class="ml-1">{{ cat.category }}</span>
          </div>
        </button>
      </ng-container>
    </div>
  `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CategoryVcaComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryVcaComponent
  implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges
{
  @Input() init_category: string;
  @Input() reset_category: boolean;
  selectedCategories: any[] = [];
  onChange: any = () => {};
  onTouch: any = () => {};
  selected_category = '';
  category_list: Product[] = [];
  constructor(
    private cd: ChangeDetectorRef,
    private designCategoryMenuService: DesignCategoryMenuService
  ) {}
  ngOnInit(): void {
    // console.log('ngOnInit: ', this.category_list);
  }
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit: ', this.category_list);
    this.designCategoryMenuService.getMyCategory().subscribe((data) => {
      // console.log('getMyCategory: ', data);
      this.selectedCategories = data;
      this.cd.detectChanges();
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.log('ngOnChanges: ', changes);
    if (changes['init_category'] && changes['init_category'].currentValue) {
      this.selected_category = changes['init_category'].currentValue;
      this.onChange(this.selected_category);
    }
    if (changes['reset_category'] && changes['reset_category'].currentValue) {
      this.selected_category = '';
    }
  }

  selectValue(value: {group: string, category: string}) {
    // console.log('category: ', value);
    this.selected_category = value.category;
    this.onChange(value.category);
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
