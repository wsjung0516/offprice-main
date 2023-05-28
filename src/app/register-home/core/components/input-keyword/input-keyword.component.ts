import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  Observable,
  pluck,
} from 'rxjs';
import { RemoveChipsKeywordService } from 'src/app/core/services/remove-chips-keyword.service';

@UntilDestroy()
@Component({
  selector: 'app-input-keyword',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  template: `
    <div
      class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
    ></div>
    <input
      type="search"
      [(ngModel)]="inputKeyword"
      #inputSearch
      id="default-search"
      class="block p-4 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-500 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Search"
      required
    />
    <button
      type="submit"
      class="text-white absolute right-1 bottom-1.5 bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      (click)="onInputSearchKeyword(inputSearch.value)"
    >
      <mat-icon>search</mat-icon>
    </button>
  `,
  styles: [
    `
      #default-search {
        border: 1px solid black;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputKeywordComponent implements OnInit, AfterViewInit {
  inputWord: any;
  inputKeyword = '';
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService,
    private cd: ChangeDetectorRef,
    private removeChipsKeywordService: RemoveChipsKeywordService
  ) {}
  ngOnInit(): void {
    this.sharedMenuObservableService.reset_input_keyword$
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.reset();
      });
  }
  ngAfterViewInit(): void {
    this.inputWord = document.getElementById('default-search');
    fromEvent(this.inputWord, 'input')
      .pipe(untilDestroyed(this), debounceTime(400), distinctUntilChanged())
      .subscribe((data: any) => {
        // console.log('data.target.value',data.target.value);
        this.onInputSearchKeyword(data.target.value);
      });
  }
  onInputSearchKeyword(data: string): void {
    if (data === '') {
      const value = { key: 'input_keyword', value: data };
      this.chipsKeywordService.removeChipKeyword(value);
      this.removeChipsKeywordService.resetSearchKeyword({
        key: 'input_keyword',
        value: data,
      });
      return;
    }
    const value = { key: 'input_keyword', value: data };
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
    // To make observable value change, which will be used make-where-condition.service.ts
    this.sharedMenuObservableService.input_keyword.next(data);
    // this.favoriteSeason = data;
  }
  reset() {
    this.inputKeyword = '';
    this.cd.detectChanges();
  }
}
