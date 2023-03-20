import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESize } from 'src/app/core/constants/data-define';

@Component({
  selector: 'app-select-size',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap">
      <ng-container *ngFor="let size of sizes | keyvalue">
        <button
          class="box-size flex items-center justify-center cursor-pointer"
          [ngClass]="{ sel_class: size.value === selected_category }"
          (click)="selectSize(size)"
        >
          {{ size.value }}
        </button>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .box-size {
        width: 3rem;
        height: 3rem;
        margin: 0.25rem;
        border: 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 0.25rem;
      }
      .sel_class {
        background-color: lightgray;
      }
    `,
  ],
})
export class SelectSizeComponent {
  sizes: typeof ESize = ESize;
  selected_category: string = '';

  selectSize(size: any) {
    console.log(size);
    this.selected_category = size.value;
  }
}
