import { ChangeDetectorRef, Injectable } from '@angular/core';
import { RegisterChipsKeywordService, SearchKeyword } from '../services/register-chips-keyword.service';
import { LocalStorageService } from './local-storage.service';
import { RegisterMenuObservableService } from '../services/register-menu-observable.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterRemoveChipsKeywordService {
  constructor(
    private registerChipsKeywordService: RegisterChipsKeywordService,
    private registerMenuObservableService: RegisterMenuObservableService,
    private localStorageService: LocalStorageService // private cd: ChangeDetectorRef
  ) {}
  async resetSearchKeyword(keyword: SearchKeyword) {
    const value = { key: keyword['key'], value: keyword['value'] };
    // Remove chip from the chips array
    this.registerChipsKeywordService.removeChipKeyword(value);

    const keywordResetMap: { [key: string]: () => void } = {
      price: () => this.registerMenuObservableService.price.next('All'),
      category: () => {
        this.registerMenuObservableService.category.next('All');
        // To set 'All' button to active whenever remove chips keyword in category menu
        // This value will be used in category menu component
        this.localStorageService.setItem('category', 'All');
      },
      size: () => {
        // Clear makeWhereConditionService if there is size value input already
        this.registerMenuObservableService.input_keyword.next('');
        // Clear input tag in the DOM.
        this.registerMenuObservableService.reset_input_keyword.next('');
      },
      material: () => {
        this.registerMenuObservableService.input_keyword.next('');
        this.registerMenuObservableService.reset_input_keyword.next('');
      },
      search_period: () =>
        this.registerMenuObservableService.search_period.next('All'),
        // color, material, size 도 input_keyword 와 같은 방식으로 처리하는 이유는 
        // color, material, size Table 에는 다양한 종류의 값이 있기 때문에 단순히 검색어 하나로 로 처리할 수 없기 때문에,
        // 마치 input_keyword 와 같이 검색어를 입력하고 엔터를 눌러서 검색하는 방식으로 처리하기 위해서이다.
      color: () => {
        this.registerMenuObservableService.input_keyword.next('');
        this.registerMenuObservableService.reset_input_keyword.next('');
      },

      input_keyword: () => {
        this.registerMenuObservableService.input_keyword.next('');
        this.registerMenuObservableService.reset_input_keyword.next('');
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
