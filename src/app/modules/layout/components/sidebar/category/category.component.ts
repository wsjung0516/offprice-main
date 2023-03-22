import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { Categories } from 'src/app/core/constants/data-define';
import { SearchKeywordService } from 'src/app/core/services/search-keyword.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule],
template: `

      <div class="">
        <div class="">
          <!-- [(ngModel)]="favoriteSeason" -->
          <mat-radio-group 
            class="discount-radio-group"
          >
            <mat-radio-button
              class=""
              *ngFor="let category of categories"
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
  categories = Categories;
  constructor(private searchKeywordService: SearchKeywordService) {}
  selectValue(data: any) {
    const value = {key: 'category', value: data.value};
    this.searchKeywordService.removeSearchKeyword(value);
    this.searchKeywordService.addSearchKeyword(value);
    // this.favoriteSeason = data;
  }

}
