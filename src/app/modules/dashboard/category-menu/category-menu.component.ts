import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Categories } from 'src/app/core/constants/data-define';
import { SearchKeywordService } from 'src/app/core/services/search-keyword.service';

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
      <ng-container *ngFor="let button of categories">
      <!-- <button class="border border-gray-300 py-1 px-2 bg-white text-gray-700 button-group">
        {{button.key}}
      </button> -->
        <button mat-button-toggle class="border-2 border-transparent rounded-full py-2 px-4 mx-1 text-gray-500 hover:text-gray-800 focus:outline-none focus:border-blue-500 active:text-blue-500 button-group " [ngClass]="{'selected': selectedButton.key === button.key}" [value]="button" (click)="onSelect(button)" >
          {{button.key}}
        </button>
      </ng-container>
    </div>
  </div>
</div>

`,
  styles: [
    `
   .button-group {
  border: 1px solid #ccc;
  padding: 5px 10px;
  background-color: #fff;
  color: #333;
}

.button-group.selected {
  background-color: #007bff;
  color: #fff;
} 
    `
  ]
})
export class CategoryMenuComponent implements OnInit{
  @ViewChild('container') container!: ElementRef;
  categories = Categories;
  buttonWidth = 40;
  scrollDistance = 200;
  scrollOffset = 0;
  selectedButton: any = {key:'Women', value: 'Women'};
  constructor(private searchKeywordService: SearchKeywordService) {}
  ngOnInit() {
    this.onSelect(this.selectedButton);
  }
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
  onSelect(button: any) {
    this.selectedButton = button;
    const value = {key: 'Category', value: button.key};
    this.searchKeywordService.removeSearchKeyword(value);
    this.searchKeywordService.addSearchKeyword(value);

  }
}
