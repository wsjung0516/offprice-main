import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, from, groupBy, toArray } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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
  private searchKeyword = new BehaviorSubject<SearchKeyword[]>([]);
  searchKeyword$ = this.searchKeyword.asObservable();

  constructor() {}

  addChipKeyword(searchKeyword: { key: string; value: string }) {
    // console.log('addChipKeyword: ', searchKeyword)
    if (!this.keywords.some((obj) => obj['key'] === searchKeyword.key)) {
      this.keywords.push({
        key: searchKeyword.key,
        value: searchKeyword.value,
      });
      this.searchKeyword.next(this.keywords);
    }
    // if (!this.keywords.some((obj) => obj.key === searchKeyword.key)) {
    //   this.keywords.push(searchKeyword);
    //   this.searchKeyword.next(this.keywords);
    // }
  }
  removeChipKeyword(searchKeyword: { key: string; value: string }) {
    if (this.keywords.some((obj) => obj['key'] === searchKeyword.key)) {
      from(this.keywords)
        .pipe(
          untilDestroyed(this),
          filter((obj) => obj['key'] !== searchKeyword.key),
          toArray()
        )
        .subscribe((obj) => {
          this.keywords = obj;
          this.searchKeyword.next(obj);
        });
    }
  }
}
