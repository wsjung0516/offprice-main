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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { toObservable } from '@angular/core/rxjs-interop';

@UntilDestroy()
@Component({
  selector: 'app-input-keyword',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="flex items-center">
      <input
        type="search"
        [formControl]="inputKeyword"
        #inputSearch
        id="default-search"
        class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-500 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search"
        required
      />
      <button
        type="submit"
        class="text-blue-600 absolute border border-blue-600 right-1  bg-white hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-2 py-1 "
        (click)="onInputSearchKeyword(inputSearch.value)"
      >
        <mat-icon>search</mat-icon>
      </button>
    </div>
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
  inputKeyword = new FormControl('');
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService,
    private cd: ChangeDetectorRef,
    private removeChipsKeywordService: RemoveChipsKeywordService
  ) {
    toObservable(this.reset_input_keyword)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.reset();
      });
  }
  reset_input_keyword = this.sharedMenuObservableService.reset_input_keyword;
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.inputKeyword.valueChanges
      .pipe(untilDestroyed(this), debounceTime(400), distinctUntilChanged())
      .subscribe((value: string) => {
        console.log('data.target.value', value);
        this.onInputSearchKeyword(value);
      });
  }
  onInputSearchKeyword(data: string): void {
    // if (data === '') {
    //   const value = { key: 'input_keyword', value: data };
    //   this.chipsKeywordService.removeChipKeyword(value);
    //   this.removeChipsKeywordService.resetSearchKeyword({
    //     key: 'input_keyword',
    //     value: data,
    //   });
    //   return;
    // }
    const value = { key: 'input_keyword', value: data };
    // To make observable value change, which will be used make-where-condition.service.ts
    this.sharedMenuObservableService.input_keyword.set(data);
    // this.favoriteSeason = data;
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
  }
  reset() {
    this.inputKeyword.patchValue('');
    this.cd.detectChanges();
  }
}
