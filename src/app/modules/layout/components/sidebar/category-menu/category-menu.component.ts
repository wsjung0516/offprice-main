import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Categories } from 'src/app/core/constants/data-define';
import { ShowMenuDialogService } from 'src/app/core/services/show-menu-dialog.service';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule],
template: `
    <div class="bg-gray-200 px-4 py-2 flex items-center">
      <div class="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div class="inline-flex" [style.margin-left.px]="scrollOffset">
          <ng-container *ngFor="let button of categories">
            <button
              mat-button-toggle
              class="border-2 border-transparent rounded-full py-2 px-4 mx-1 text-gray-500 hover:text-gray-800 focus:outline-none focus:border-blue-500 active:text-blue-500 button-group"
              [ngClass]="{ selected: selected_category.key === button.key }"
              [value]="button"
              (click)="onSelect(button)"
            >
              {{ button.key }}
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
        padding: 5px 10px;
        background-color: #fff;
        color: #333;
      }

      .button-group.selected {
        background-color: #007bff;
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
})
export class CategoryMenuComponent implements OnInit {
  @ViewChild('container') container!: ElementRef;
  categories = Categories;
  buttonWidth = 40;
  scrollDistance = 200;
  scrollOffset = 0;
  selected_category: any = { key: 'All', value: 'All' };
  private storageItemSubscription: Subscription | undefined;
  constructor(    private showMenuDialogService: ShowMenuDialogService,
    private chipsKeywordService: ChipsKeywordService,
    private localStorageService: LocalStorageService,
    private cd: ChangeDetectorRef

) {}
  ngOnInit() {
    this.onSelect(this.selected_category);
    this.subscribeToLocalStorageItem()
  }
  onScroll(distance: number) {
    const scrollEl = document.querySelector('.scroll-container') as HTMLElement;
    const direction = distance > 0 ? 1 : -1;
    const currentOffset = scrollEl.scrollLeft;
    const newOffset = currentOffset + direction * this.buttonWidth;
    scrollEl.scrollTo({
      left: newOffset,
      behavior: 'smooth',
    });
  }
  onSelect(category: any) {
    this.selected_category = category;
    const value = { key: 'category', value: category.key };
    // this.selected_category = value.key;
    this.showMenuDialogService.category.next(category.key);
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
  }
  // This method is called from localStorage when the user clicks remove button chip of chips,
  // Where save 'All' to localStorage
  // Which is sale-list-header.component.ts
  subscribeToLocalStorageItem(): void {
    this.storageItemSubscription =
      this.localStorageService.storageItem$.subscribe((item) => {
        // console.log('category-- called from localstorage', item)
        if (item && item.key === 'category') {
          this.onSelect({key:'All',value:'All'});
          this.cd.markForCheck();
        }
      });
  }
  ngOnDestroy() {
    if (this.storageItemSubscription) {
      this.storageItemSubscription.unsubscribe();
    }
  }
}
