import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Categories, Categories2, Product } from 'src/app/core/constants/data-define';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-gray-200 px-1 py-2 flex items-center">
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
export class CategoryMenuComponent implements OnInit, AfterViewInit {
  // @ViewChild('container') container!: ElementRef;
  categories: Product[] = [];
  buttonWidth = 40;
  scrollDistance = 200;
  scrollOffset = 0;
  selected_category: any = { key: 'All', value: 'All' };
  private storageItemSubscription: Subscription | undefined;
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService,
    private localStorageService: LocalStorageService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.onSelect(this.selected_category);
    this.subscribeToLocalStorageItem();
    this.sharedMenuObservableService.reset_category$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.reset();
      });
  }
  // onScroll(distance: number) {
  //   const scrollEl = document.querySelector('.scroll-container') as HTMLElement;
  //   const direction = distance > 0 ? 1 : -1;
  //   const currentOffset = scrollEl.scrollLeft;
  //   const newOffset = currentOffset + direction * this.buttonWidth;
  //   scrollEl.scrollTo({
  //     left: newOffset,
  //     behavior: 'smooth',
  //   });
  // }
  ngAfterViewInit() {
    let cat = '';
    this.sharedMenuObservableService.category1$
    .pipe(untilDestroyed(this)).subscribe((id) => {
      cat = id;
      this.categories = Categories2.filter((item) => item.categoryId === cat);
      this.cd.detectChanges();
    });
  }
  onSelect(category: any) {
    this.selected_category = category;
    const value = { key: 'category', value: category.key };
    // this.selected_category = value.key;
    this.sharedMenuObservableService.category.next(category.key);
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
  }
  // This method is called from localStorage when the user-profile clicks remove button chip of chips,
  // Where save 'All' to localStorage
  // Which is sale-list-header.component.ts
  subscribeToLocalStorageItem(): void {
    this.storageItemSubscription =
      this.localStorageService.storageItem$.subscribe((item) => {
        // console.log('category-- called from localstorage', item)
        if (item && item.key === 'category') {
          this.onSelect({ key: 'All' });
          this.cd.markForCheck();
        }
      });
  }
  ngOnDestroy() {
    if (this.storageItemSubscription) {
      this.storageItemSubscription.unsubscribe();
    }
  }
  reset() {}
}
