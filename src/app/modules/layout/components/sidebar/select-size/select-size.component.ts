import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sizes } from 'src/app/core/constants/data-define';
import { ShowMenuDialogService } from 'src/app/core/services/show-menu-dialog.service';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';

@Component({
  selector: 'app-select-size',
  standalone: true,
  imports: [CommonModule],
template: `
    <div class="flex flex-wrap">
      <ng-container *ngFor="let size of sizes">
        <button
          class="box-size flex items-center justify-center cursor-pointer"
          [ngClass]="{ sel_class: size.key === selected_size }"
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
  selected_size: string = '';
  constructor(    private showMenuDialogService: ShowMenuDialogService,
    private chipsKeywordService: ChipsKeywordService
) {}
  selectSize(size: any) {
    const value = { key: 'size', value: size.key };
    this.selected_size = size.key;
    this.showMenuDialogService.size.next(size.key);
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
  }
}
