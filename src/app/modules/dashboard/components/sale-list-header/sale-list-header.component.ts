import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MenuService } from 'src/app/core/services/menu.service';
import { Observable, Subscription } from 'rxjs';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import { SearchKeywordService } from 'src/app/core/services/search-keyword.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ChipsKeywordService, SearchKeyword } from 'src/app/core/services/chips-keyword.service';
import { ShowMenuDialogService } from 'src/app/core/services/show-menu-dialog.service';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
  CommonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  selector: 'app-sale-list-header',
  templateUrl: './sale-list-header.component.html',
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
    private searchKeywordService: SearchKeywordService,
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
    this.screenSize$.pipe(untilDestroyed(this)).subscribe((result) => {
      this.sSize = result;
    });
    //
    // make chips for display in the DOM
    this.chipsKeywordService.searchKeyword$
      .pipe(untilDestroyed(this))
      .subscribe((result: any[]) => {
        this.keywords = [];
        result.forEach((obj) => {
          if (obj.value !== '' && obj.key === 'keyword')
            this.keywords.push(obj);
          if (obj.value !== 'All' && obj.key !== 'keyword')
            this.keywords.push(obj);
          this.cd.detectChanges();
        });
      });
    // This value is from the SaleListComponent.
    this.storageItemSubscription = this.localStorageService.storageItem$.subscribe((item) => {
        if (item && item.key === 'searchItemsLength') {
          // console.log('LocalStorage item updated:');
          // console.log('Key:', item.key);
          // console.log('Value:', item.value);
          this.searchItemLength = +item.value;
          this.cd.markForCheck();
        }
      });  
  }
  onSearchKeyword(data: string): void {
    if( data === '') {
      const value = {key: 'Search', value: data};
      this.searchKeywordService.removeSearchKeyword(value);
      return;
    }
    const value = {key: 'Search', value: data};
    this.searchKeywordService.removeSearchKeyword(value);
    this.searchKeywordService.addSearchKeyword(value);
    // this.favoriteSeason = data;
  }
  inputKeyword: string = '';
  removeChipsKeyword(keyword: SearchKeyword) {
    const value = { key: keyword['key'], value: keyword['value'] };
    // Remove chip from the chips array
    this.chipsKeywordService.removeChipKeyword(value);
    // console.log('removeChipsKeyword', keyword['key']);
    if (keyword['key'] === 'price') {
      this.showMenuDialogService.price.next('All');
    } else if (keyword['key'] === 'category') {
      this.showMenuDialogService.category.next('All');
    } else if (keyword['key'] === 'size') {
      this.showMenuDialogService.size.next('All');
    } else if (keyword['key'] === 'material') {
      this.showMenuDialogService.material.next('All');
    } else if (keyword['key'] === 'search_period') {
      this.showMenuDialogService.search_period.next('All');
    } else if (keyword['key'] === 'keyword') {
      this.showMenuDialogService.keywords.next('');
      // clear search keyword
      console.log('clear search keyword')
      this.inputKeyword = '';
      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.storageItemSubscription) {
      this.storageItemSubscription.unsubscribe();
    }
  }
}
