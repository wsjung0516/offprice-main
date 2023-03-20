import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ECondition } from 'src/app/interfaces/data-define';

@Component({
  selector: 'app-condition',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule],
  template: `

      <div class="">
        <div class="">
          <mat-radio-group
            aria-labelledby="example-radio-group-label"
            class="discount-radio-group"
            [(ngModel)]="favoriteSeason"
          >
            <mat-radio-button
              class=""
              *ngFor="let category of categories | keyvalue"
              [value]="category"
              (change)="selectValue(category)"
            >
              {{ category.value }}
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
      ::ng-deep 
        .mat-radio-button
        .mat-radio-button-label
        {
        font-size: 16px;
      }
    `,
  ],
})

export class ConditionComponent {
  favoriteSeason: string | undefined;
  // seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  categories: typeof ECondition = ECondition;
  selectValue(value: any) {
    console.log('discount: ', value);
    this.favoriteSeason = value;
  }

}
