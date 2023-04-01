import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EMaterial } from 'src/app/core/constants/data-define';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ShowMenuDialogService } from 'src/app/core/services/show-menu-dialog.service';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule],
  template: `
    <div class="flex_wrap">
        <ng-container *ngFor="let material of materials">
          <button
          class="box-size flex items-center justify-center cursor-pointer"
          [ngClass]="{ sel_class: material.key === selected_material }"
            (click)="selectValue(material)"
            >{{ material.key }}
          </button>
        </ng-container>
    </div>
  `,
  styles: [
    `
      .flex_wrap {
        display: flex;
        flex-wrap: wrap;
      }

     .box-size {
        width: auto;
        padding: 0.5rem;
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
export class MaterialComponent {
  selected_material: string | undefined;
  materials: typeof EMaterial = EMaterial;
  constructor(
    private showMenuDialogService: ShowMenuDialogService,
    private chipsKeywordService: ChipsKeywordService
  ) {}
  selectValue(material: any) {
    const value = { key: 'material', value: material.key };
    this.selected_material = value.key;
    this.showMenuDialogService.material.next(material.key);
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
  }
}
