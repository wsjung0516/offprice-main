import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, from, toArray } from "rxjs";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class SearchKeywordService {
  keywords: any[] = [];
  private searchKeyword = new BehaviorSubject<{}[]>([]);
  currentSearchKeyword$ = this.searchKeyword.asObservable();

  constructor() { }

  addSearchKeyword(searchKeyword: {key: string, value: string}) {
    if( !this.keywords.some(obj => obj.key === searchKeyword.key)) {
      this.keywords.push(searchKeyword);
      //console.log('this.keywords', this.keywords);
      this.searchKeyword.next(this.keywords);
    }
  }
  removeSearchKeyword(searchKeyword: {key: string, value: string}) {
    if( this.keywords.some(obj => obj.key === searchKeyword.key)) {
      from(this.keywords).pipe(
        untilDestroyed(this),
        filter(obj => obj.key !== searchKeyword.key),
        toArray(),
        ).subscribe((obj) => {
        this.keywords = obj;
        this.searchKeyword.next(obj);
      })
    }
  }
}