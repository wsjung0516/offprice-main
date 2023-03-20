import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { APrice } from 'src/app/core/constants/data-define';

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
})
export class PriceRangeComponent {
  priceRange: any;
  priceRanges = [...APrice];
  selectValue(price: any) {
    console.log('priceRange: ', price.value);
    this.priceRange = price.value;
  }
}
