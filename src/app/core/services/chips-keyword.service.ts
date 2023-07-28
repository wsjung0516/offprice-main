import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, filter, from, toArray } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedMenuObservableService } from './shared-menu-observable.service';

export interface SearchKeyword {
  [key: string]: string;
}
@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class ChipsKeywordService {
  keywords: SearchKeyword[] = [];
  // keywords: {[key:string]:string}[] = [];
  // private searchKeyword = new BehaviorSubject<SearchKeyword[]>([]);
  // searchKeyword$ = this.searchKeyword.asObservable();
  searchKeyword = signal<SearchKeyword[]>([]);

  constructor(
    private sharedMenuObservableService: SharedMenuObservableService
  ) {}
  // add keyword ot search keyword array
  addChipKeyword(searchKeyword: { key: string; value: string }) {
    // console.log('addChipKeyword: ', searchKeyword)
    if (!this.keywords.some((obj) => obj['key'] === searchKeyword.key)) {
      this.keywords.push({
        key: searchKeyword.key,
        value: searchKeyword.value,
      });
      this.searchKeyword.set(this.keywords);
      // this.searchKeyword.next(this.keywords);
    }
  }
  // remove keyword from search keyword array because new keyword is added 
  // instead of old keyword in the search keyword array 
  // For example, if you want to search color 'red' and then need to remove color category,
  removeChipKeyword(searchKeyword: { key: string; value: string }) {
    if (this.keywords.some((obj) => obj['key'] === searchKeyword.key)) {
      from(this.keywords)
      .pipe(
        untilDestroyed(this),
        filter((obj:any) => obj['key'] !== searchKeyword.key),
        toArray()
        )
        .subscribe((obj) => {
          // console.log('obj: ', obj)
          this.keywords = obj;
          this.searchKeyword.set(obj);
          // this.searchKeyword.next(obj);
        });
    }
  }
}
