import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ESearchPeriod } from 'src/app/register-home/core/constants/data-define';
import { RegisterChipsKeywordService } from '../../core/services/register-chips-keyword.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ShowMenuDialogComponent } from '../show-menu-dialog-component/show-menu-dialog-component';
import { RegisterMenuObservableService } from '../../core/services/register-menu-observable.service';

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
    private registerChipsKeywordService: RegisterChipsKeywordService,
    private registerMenuObservableService: RegisterMenuObservableService
  ) {}
  selectValue(data: any) {
    const value = { key: 'search_period', value: data.key };
    this.registerChipsKeywordService.removeChipKeyword(value);
    this.registerChipsKeywordService.addChipKeyword(value);
    this.registerMenuObservableService.search_period.next(data.value);
    this.dialogRef.close();
  }
}
