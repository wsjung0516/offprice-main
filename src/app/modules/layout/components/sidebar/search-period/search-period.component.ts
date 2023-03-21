import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ESearchPeriod } from 'src/app/core/constants/data-define';
import { SearchKeywordService } from 'src/app/core/services/search-keyword.service';

@Component({
  selector: 'app-search-period',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule],
  template: `
      <div class="">
        <div class="">
          <mat-radio-group 
            class="discount-radio-group"
            [(ngModel)]="favoritePeriod"
          >
            <mat-radio-button
              class=""
              *ngFor="let period of periods"
              [value]="period"
              (change)="selectValue(period)"
            >
              {{ period.key }}
            </mat-radio-button>
          </mat-radio-group>
        </div>
      </div>
  `,
  styles: [
    `
      .discount-radio-group {
        display: flex;
        flex-direction: column;
        margin: 14px 0;
        align-items: flex-start;
      }
    `,
  ],
})

export class SearchPeriodComponent {
  favoritePeriod: string | undefined;
  periods: typeof ESearchPeriod = ESearchPeriod;
  constructor(private searchKeywordService: SearchKeywordService) {}
  selectValue(data: any) {
    const value = {key: 'SearchPeriod', value: data.key};
    this.searchKeywordService.removeSearchKeyword(value);
    this.searchKeywordService.addSearchKeyword(value);
    // this.favoriteSeason = data;
  }

}
