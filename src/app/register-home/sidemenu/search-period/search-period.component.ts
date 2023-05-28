import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ESearchPeriod } from 'src/app/register-home/core/constants/data-define';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ShowMenuDialogComponent } from '../show-menu-dialog-component/show-menu-dialog-component';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';

@Component({
  selector: 'app-search-period',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule],
  template: `
    <div class="">
      <div class="flex justify-center">
        <mat-radio-group class="discount-radio-group">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPeriodComponent {
  @Input() dialogRef: MatDialogRef<ShowMenuDialogComponent>;
  periods: typeof ESearchPeriod = ESearchPeriod;
  constructor(
    private chipsKeywordService: ChipsKeywordService,
    private sharedMenuObservableService: SharedMenuObservableService
  ) {}
  selectValue(data: any) {
    const value = { key: 'search_period', value: data.key };
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
    this.sharedMenuObservableService.search_period.next(data.value);
    this.dialogRef.close();
  }
}
