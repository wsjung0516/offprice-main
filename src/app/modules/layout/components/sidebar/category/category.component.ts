import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ECategory } from 'src/app/core/constants/data-define';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule],
  template: `

      <div class="">
        <div class="">
          <mat-radio-group 
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
        margin: 14px 0;
        align-items: flex-start;
      }
    `,
  ],
})

export class CategoryComponent {
  favoriteSeason: string | undefined;
  // seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  categories: typeof ECategory = ECategory;
  selectValue(value: any) {
    console.log('discount: ', value);
    this.favoriteSeason = value;
  }

}
