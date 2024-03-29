import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import {
  Categories,
  Categories2,
  Product,
} from 'src/app/core/constants/data-define';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { toObservable } from '@angular/core/rxjs-interop';
@UntilDestroy()
@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-gray-200 px-1 py-1 flex items-center">
      <!-- <div class="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide"> -->
      <div
        class="flex-1 overflow-x-auto hover:overflow-scroll whitespace-nowrap"
      >
        <div class="inline-flex" [style.margin-left.px]="scrollOffset">
          <ng-container *ngFor="let button of categories">
            <button
              mat-button-toggle
              class="border border-transparent rounded-full py-1 px-2 mx-1 text-gray-500 hover:text-gray-800 focus:outline-none focus:border-blue-500 active:text-blue-500 button-group"
              [ngClass]="{
                selected: selected_category.key === button.key,
                group1: button.group === '1',
                group2: button.group === '2'
              }"
              [value]="button"
              (click)="onSelect(button)"
            >
              <span class="">{{ button.key }}</span>
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
        padding: 1px 5px;
        background-color: #fff;
        color: #333;
      }

      .button-group.selected {
        background-color: #007bff;
        color: #fff;
      }
      .group1 {
        border: 1px solid #ef4444;
      }
      .group2 {
        border: 1px solid #4f46e5;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }

      /* For IE, Edge and Firefox  #10b981  #84cc16 #eab308 #0ea5e9 #8b5cf6 #78716c*/
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
  ) {
    toObservable(this.reset_category)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.reset();
      });

  }
  reset_category = this.sharedMenuObservableService.reset_category;
  ngOnInit() {
    this.onSelect(this.selected_category);
    this.subscribeToLocalStorageItem();
  }
  category1 = this.sharedMenuObservableService.category1;
  ngAfterViewInit() {
    let cat = '';
    toObservable(this.category1)
      .pipe(untilDestroyed(this))
      .subscribe((id) => {
        cat = id;
        this.categories = Categories2.filter((item) => item.categoryId === cat);
        this.cd.detectChanges();
      });
    // this.sharedMenuObservableService.category1$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((id) => {
    //     cat = id;
    //     this.categories = Categories2.filter((item) => item.categoryId === cat);
    //     this.cd.detectChanges();
    //   });
  }
  onSelect(category: any) {
    this.selected_category = category;
    const value = { key: 'category', value: category.key };
    // this.selected_category = value.key;
    this.sharedMenuObservableService.category.set(category.key);
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
