import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sizes } from 'src/app/core/constants/data-define';
import { SearchKeywordService } from 'src/app/core/services/search-keyword.service';

@Component({
  selector: 'app-select-size',
  standalone: true,
  imports: [CommonModule],
template: `
    <div class="flex flex-wrap">
      <ng-container *ngFor="let size of sizes">
        <button
          class="box-size flex items-center justify-center cursor-pointer"
          [ngClass]="{ sel_class: size.key === selected_category }"
          (click)="selectSize(size)"
        >
          {{ size.key }}
        </button>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .box-size {
        width: 3rem;
        height: 2rem;
        margin: 0.25rem;
        border: 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 0.25rem;
      }
      .sel_class {
        background-color: #2962FF;
        color: white;
      }
    `,
  ],
})
export class SelectSizeComponent {
  sizes = Sizes;
  selected_category: string = '';
  constructor(private searchKeywordService: SearchKeywordService) {}
  selectSize(data: any) {
    const value = {key: 'Size', value: data.key};
    this.searchKeywordService.removeSearchKeyword(value);
    this.searchKeywordService.addSearchKeyword(value);
    this.selected_category = data.key;
    // this.favoriteSeason = data;
  }
}
