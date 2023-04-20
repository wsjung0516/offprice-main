import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ChipsKeywordService, SearchKeyword } from './chips-keyword.service';
import { LocalStorageService } from './local-storage.service';
import { SharedMenuObservableService } from './shared-menu-observable.service';

@Injectable({
  providedIn: 'root',
})
export class RemoveChipsKeywordService {
  constructor(
    private chipsKeywordService: ChipsKeywordService,
    private SharedMenuObservableService: SharedMenuObservableService,
    private localStorageService: LocalStorageService // private cd: ChangeDetectorRef
  ) {}
  async resetSearchKeyword(keyword: SearchKeyword) {
    const value = { key: keyword['key'], value: keyword['value'] };
    // Remove chip from the chips array
    this.chipsKeywordService.removeChipKeyword(value);

    const keywordResetMap: { [key: string]: () => void } = {
      price: () => this.SharedMenuObservableService.price.next('All'),
      category: () => {
        this.SharedMenuObservableService.category.next('All');
        // To set 'All' button to active whenever remove chips keyword in category menu
        // This value will be used in category menu component
        this.localStorageService.setItem('category', 'All');
      },
      size: () => this.SharedMenuObservableService.size.next('All'),
      material: () => this.SharedMenuObservableService.material.next('All'),
      search_period: () =>
        this.SharedMenuObservableService.search_period.next('All'),
      input_keyword: () => {
        this.SharedMenuObservableService.input_keyword.next('');
        this.SharedMenuObservableService.reset_input_keyword.next('');
        // clear search keyword in the sale-list-header.component
        // this.inputKeyword = '';
        // this.cd.detectChanges();
      },
    };

    const key = keyword['key'];

    if (keywordResetMap.hasOwnProperty(key)) {
      await keywordResetMap[key]();
    }
  }
}
