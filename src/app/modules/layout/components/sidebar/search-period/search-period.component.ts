import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ESearchPeriod } from 'src/app/core/constants/data-define';
import { ShowMenuDialogService } from 'src/app/core/services/show-menu-dialog.service';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';


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
  constructor(
    private showMenuDialogService: ShowMenuDialogService,
    private chipsKeywordService: ChipsKeywordService

  ) {}
  selectValue(data: any) {
    const value = { key: 'search_period', value: data.key };
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
    this.showMenuDialogService.search_period.next(data.value);
    // this.favoriteSeason = data;
  }

}
