import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ECategory } from 'src/app/core/constants/data-define';

@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [CommonModule,
  MatIconModule,
  ],
  template: `
<div class="bg-gray-200 px-4 py-2 flex items-center">
  <div class="flex-1 overflow-x-auto whitespace-nowrap" >
    <div class="inline-flex" [style.margin-left.px]="scrollOffset">
      <ng-container *ngFor="let button of categories | keyvalue">
        <button mat-button-toggle class="border-2 border-transparent rounded-full py-2 px-4 mx-1 text-gray-500 hover:text-gray-800 focus:outline-none focus:border-blue-500 active:text-blue-500" [value]="button">{{button.key}}</button>
      </ng-container>
    </div>
  </div>
</div>

`,
  styles: []
})
export class CategoryMenuComponent {
  @ViewChild('container') container!: ElementRef;
  categories: typeof ECategory = ECategory;
  buttonWidth = 40;
  scrollDistance = 200;
  scrollOffset = 0;
  onScroll(distance: number) {
    const scrollEl = document.querySelector('.scroll-container') as HTMLElement;
    const direction = distance > 0 ? 1 : -1;
    const currentOffset = scrollEl.scrollLeft;
    const newOffset = currentOffset + (direction * this.buttonWidth);
    scrollEl.scrollTo({
      left: newOffset,
      behavior: 'smooth'
    });
  }
}
