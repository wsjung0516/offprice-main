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
    private sharedMenuObservableService: SharedMenuObservableService,
    private localStorageService: LocalStorageService // private cd: ChangeDetectorRef
  ) {}
  async resetSearchKeyword(keyword: SearchKeyword) {
    const value = { key: keyword['key'], value: keyword['value'] };
    // Remove chip from the chips array
    this.chipsKeywordService.removeChipKeyword(value);

    const keywordResetMap: { [key: string]: () => void } = {
      price: () => this.sharedMenuObservableService.price.next('All'),
      category: () => {
        this.sharedMenuObservableService.category.next('All');
        // To set 'All' button to active whenever remove chips keyword in category menu
        // This value will be used in category menu component
        this.localStorageService.setItem('category', 'All');
      },
      size: () => {
        this.sharedMenuObservableService.input_keyword.next('');
        this.sharedMenuObservableService.reset_input_keyword.next('');
      },
      material: () => {
        this.sharedMenuObservableService.input_keyword.next('');
        this.sharedMenuObservableService.reset_input_keyword.next('');
      },
      search_period: () =>
        this.sharedMenuObservableService.search_period.next('All'),
        // color, size, material 도 input_keyword 와 같은 방식으로 처리하는 이유는 
        // color, size material Table 에는 다양한 종류의 값이 있기 때문에 단순히 검색어 하나로 로 처리할 수 없기 때문에,
        // 마치 input_keyword 와 같이 검색어를 입력하고 엔터를 눌러서 검색하는 방식으로 처리하기 위해서이다.
      color: () => {
        this.sharedMenuObservableService.input_keyword.next('');
        this.sharedMenuObservableService.reset_input_keyword.next('');
      },
      input_keyword: () => {
        this.sharedMenuObservableService.input_keyword.next('');
        this.sharedMenuObservableService.reset_input_keyword.next('');
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
