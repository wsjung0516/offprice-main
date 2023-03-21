import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { EPattern } from 'src/app/core/constants/data-define';

@Component({
  selector: 'app-pattern',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, FormsModule],
  template: `

<div class="">
      <div class="discount-radio-group">
        <mat-checkbox
          class="" *ngFor="let pattern of patterns | keyvalue"
          (change)="selectValue(pattern)"
          >{{ pattern.value }}
        </mat-checkbox>
      </div>
    </div>  `,
  styles: [
    `
      .discount-radio-group {
        display: flex;
        flex-direction: column;
        margin: 15px 0;
        align-items: flex-start;
      }
    `,
  ],
})

export class PatternComponent {
  favoritePattern: string | undefined;
  // seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  patterns: typeof EPattern = EPattern;
  selectValue(value: any) {
    console.log('discount: ', value);
    this.favoritePattern = value;
  }

}
