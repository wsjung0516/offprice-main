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
import { FormsModule } from '@angular/forms';
import { Categories, Product } from 'src/app/core/constants/data-define';
import { DesignCategoryMenuService } from '../../core/components/design-category-menu/design-category-menu.service';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';

@Component({
  selector: 'app-my-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCategoryComponent implements OnInit, AfterViewInit {
  selectedCategories: any[] = [];
  selected_category = '';
  category_list: Product[] = [];
  constructor(
    private cd: ChangeDetectorRef,
    private designCategoryMenuService: DesignCategoryMenuService,
    private sharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService
  ) {}
  ngOnInit(): void {
    // console.log('ngOnInit: ', this.category_list);
  }
  ngAfterViewInit(): void {
    // console.log('ngAfterViewInit: ');
    this.designCategoryMenuService.getMyCategory().subscribe((data) => {
      // console.log('getMyCategory: ', data);
      this.selectedCategories = data;
      this.cd.detectChanges();
    });
  }

  selectValue(value: { group: string; category: string }) {
    console.log('category: ', value);
    // this.selected_category = value.category;
    const value1 = { key: 'category', value: value.category };
    // this.selected_category = value.key;
    this.sharedMenuObservableService.category.set(value.category);
    this.chipsKeywordService.removeChipKeyword(value1);
    this.chipsKeywordService.addChipKeyword(value1);
    // this.onChange(value.category);
  }
}
