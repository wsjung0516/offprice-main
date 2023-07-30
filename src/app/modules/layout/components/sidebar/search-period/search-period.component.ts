import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ESearchPeriod } from 'src/app/core/constants/data-define';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { toObservable } from '@angular/core/rxjs-interop';

@UntilDestroy()
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPeriodComponent {
  favoritePeriod: string | undefined;
  periods: typeof ESearchPeriod = ESearchPeriod;
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService,
    private cd: ChangeDetectorRef
  ) {
    toObservable(this.reset_search_period)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.reset();
      });
  }
  reset_search_period = this.sharedMenuObservableService.reset_search_period;
  ngOnInit() {}

  selectValue(data: any) {
    const value = { key: 'search_period', value: data.key };
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
    this.sharedMenuObservableService.search_period.set(data.value);
    this.sharedMenuObservableService.closeSideBar.set(true);
    if (data.key === 'All') {
      this.reset();
    }
    // this.favoriteSeason = data;
  }
  reset() {
    // this.selectValue({key: 'All'});
    this.favoritePeriod = 'All';
    this.cd.detectChanges();
  }
}
