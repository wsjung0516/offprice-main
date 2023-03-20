import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ECategory } from 'src/app/interfaces/data-define';

@Component({
  selector: 'app-discount-value',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule],
  template: `
  `,
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
export class DiscountValueComponent {
}
