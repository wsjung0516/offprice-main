import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { APrice } from 'src/app/register-home/core/constants/data-define';
import { RegisterChipsKeywordService } from '../../core/services/register-chips-keyword.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ShowMenuDialogComponent } from '../show-menu-dialog-component/show-menu-dialog-component';
import { RegisterMenuObservableService } from '../../core/services/register-menu-observable.service';

@Component({
  selector: 'app-price',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule],
  template: `
    <div class="">
      <div class="flex justify-center">
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
  @Input() dialogRef: MatDialogRef<ShowMenuDialogComponent>;
  priceRange: any;
  priceRanges = [...APrice];
  constructor(
    private registerMenuObservableService: RegisterMenuObservableService,
    private registerChipsKeywordService: RegisterChipsKeywordService
  ) {}
  selectValue(price: { key: string; value: string }) {
    // console.log('priceRange: ', price.value);
    const value = { key: 'price', value: price.key };
    this.priceRange = price.value;
    this.registerMenuObservableService.price.next(price.value);
    this.registerChipsKeywordService.removeChipKeyword(value);
    this.registerChipsKeywordService.addChipKeyword(value);
    this.dialogRef.close();
  }
}
