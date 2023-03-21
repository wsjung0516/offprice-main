import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EMaterial } from 'src/app/core/constants/data-define';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SearchKeywordService } from 'src/app/core/services/search-keyword.service';
@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule],
  template: `
    <div class="">
      <div class="discount-radio-group">
        <mat-checkbox
          class="" *ngFor="let material of materials"
          (change)="selectValue(material)"
          >{{ material.key }}
        </mat-checkbox>
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
    `,
  ],
})
export class MaterialComponent {
  favoriteMaterial: string | undefined;
  materials: typeof EMaterial = EMaterial;
  constructor(private searchKeywordService: SearchKeywordService) {}
  selectValue(data: any) {
    const value = {key: 'Material', value: data.key};
    this.searchKeywordService.removeSearchKeyword(value);
    this.searchKeywordService.addSearchKeyword(value);
    // this.favoriteSeason = data;
  }
}