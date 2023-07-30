import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { APrice } from 'src/app/core/constants/data-define';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { toObservable } from '@angular/core/rxjs-interop';
@UntilDestroy()
@Component({
  selector: 'app-price',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule],
  template: `
    <div class="">
      <div class="">
        <mat-radio-group
          aria-labelledby="example-radio-group-label"
          class="discount-radio-group"
          [(ngModel)]="priceRange"
        >
          <mat-radio-button
            class=""
            *ngFor="let price of priceRanges"
            [value]="price"
            (change)="selectValue(price)"
          >
            {{ price.key }}
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
        margin: 15px 0;
        align-items: flex-start;
      }
      ::ng-deep .mat-radio-button .mat-radio-button-label {
        font-size: 16px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceRangeComponent {
  priceRange: any;
  priceRanges = [...APrice];
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService,
    private cd: ChangeDetectorRef
  ) {
    toObservable(this.reset_price)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.reset();
      });
  }
  reset_price = this.sharedMenuObservableService.reset_price;
  ngOnInit() {}

  selectValue(price: any) {
    const value = { key: 'price', value: price.key };
    this.priceRange = price.value;
    this.sharedMenuObservableService.price.set(price.value);
    this.sharedMenuObservableService.closeSideBar.set(true);
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
    // this.favoriteSeason = data;
  }
  reset() {
    // this.selectValue({ key: 'all'});

    this.priceRange = 'All';
    this.cd.detectChanges();
  }
}
