import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MenuService } from 'src/app/core/services/menu.service';
import { Observable, Subscription } from 'rxjs';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import { SearchKeywordService } from 'src/app/core/services/search-keyword.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import {
  ChipsKeywordService,
  SearchKeyword,
} from 'src/app/core/services/chips-keyword.service';
import { ShowMenuDialogService } from 'src/app/core/services/show-menu-dialog.service';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule } from '@angular/forms';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatBadgeModule,
    FormsModule
  ],
  selector: 'app-sale-list-header',
  templateUrl: './sale-list-header.component.html',
  styles: [
    `
      .mat-chip-list-wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
      `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleListHeaderComponent implements OnInit, OnDestroy {
  keywords: SearchKeyword[] = [];
  searchItemLength: number = 0;
  private storageItemSubscription: Subscription | undefined;
  public showMobileMenu$: Observable<boolean> = new Observable<boolean>();
  public screenSize$: Observable<any>;
  constructor(
    private menuService: MenuService,
    public screenSizeService: ScreenSizeService,
    // private searchKeywordService: SearchKeywordService,
    private localStorageService: LocalStorageService,
    private cd: ChangeDetectorRef,
    private chipsKeywordService: ChipsKeywordService,
    private showMenuDialogService: ShowMenuDialogService
  ) {
    this.showMobileMenu$ = this.menuService.showMobileMenu$;
    this.screenSize$ = this.screenSizeService.screenSize$;
  }
  sSize: string;

  ngOnInit(): void {
    this.subscribeToScreenSize();
    this.subscribeToSearchKeywords();
    this.subscribeToLocalStorageItem();
  }

  subscribeToScreenSize(): void {
    this.screenSize$.pipe(untilDestroyed(this)).subscribe((result) => {
      this.sSize = result;
      this.cd.markForCheck();
    });
  }

  subscribeToSearchKeywords(): void {
    this.chipsKeywordService.searchKeyword$
      .pipe(untilDestroyed(this))
      .subscribe((result: any[]) => {
        this.keywords = result.filter(
          (obj) =>
            (obj.value !== '' && obj.key === 'input_keyword') ||
            (obj.value !== 'All' && obj.key !== 'input_keyword')
        );
        this.cd.markForCheck();
      });
  }

  subscribeToLocalStorageItem(): void {
    this.storageItemSubscription =
      this.localStorageService.storageItem$.subscribe((item) => {
        if (item && item.key === 'searchItemsLength') {
          this.searchItemLength = +item.value;
          this.cd.markForCheck();
        }
      });
  }
  onInputSearchKeyword(data: string): void {
    if (data === '') {
      const value = { key: 'input_keyword', value: data };
      this.chipsKeywordService.removeChipKeyword(value);
      return;
    }
    const value = { key: 'input_keyword', value: data };
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
    // To make observable value change, which will be used make-where-condition.service.ts
    this.showMenuDialogService.input_keyword.next(data);
    // this.favoriteSeason = data;
  }
  inputKeyword: string = '';
  // When the user clicks close buttion in the chips.
  removeChipsKeyword(keyword: SearchKeyword) {
    const value = { key: keyword['key'], value: keyword['value'] };
    // Remove chip from the chips array
    this.chipsKeywordService.removeChipKeyword(value);

    const keywordResetMap: { [key: string]: () => void } = {
      price: () => this.showMenuDialogService.price.next('All'),
      category: () => {
        this.showMenuDialogService.category.next('All');
        // To set 'All' button to active whenever remove chips keyword in category menu
        // This value will be used in category menu component
        this.localStorageService.setItem('category', 'All');
    
      },
      size: () => this.showMenuDialogService.size.next('All'),
      material: () => this.showMenuDialogService.material.next('All'),
      search_period: () => this.showMenuDialogService.search_period.next('All'),
      input_keyword: () => {
        this.showMenuDialogService.input_keyword.next('');
        // clear search keyword
        this.inputKeyword = '';
        this.cd.detectChanges();
      },
    };

    const key = keyword['key'];

    if (keywordResetMap.hasOwnProperty(key)) {
      keywordResetMap[key]();
    }
  }

  ngOnDestroy() {
    if (this.storageItemSubscription) {
      this.storageItemSubscription.unsubscribe();
    }
  }
}
