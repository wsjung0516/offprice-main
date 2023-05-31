import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EMaterial } from 'src/app/register-home/core/constants/data-define';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ShowMenuDialogComponent } from '../show-menu-dialog-component/show-menu-dialog-component';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule],
  template: `
    <div class="p-4 flex flex_wrap">
      <ng-container *ngFor="let material of materials">
        <button
          class="box-size flex items-center justify-center cursor-pointer"
          [ngClass]="{ sel_class: material.key === selected_material }"
          (click)="selectValue(material)"
        >
          {{ material.key }}
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
        height: auto;
        margin: 0.25rem;
        border: 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 0.25rem;
      }
      .sel_class {
        background-color: #2962ff;
        color: white;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialComponent {
  @Input() dialogRef: MatDialogRef<ShowMenuDialogComponent>;
  favoriteMaterial: string | undefined;
  materials = EMaterial;
  selected_material: string | undefined;
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService
  ) {}

  selectValue(material: { key: string; value: string }) {
    console.log('material: ', material);
    const value = { key: 'material', value: material.key };
    this.selected_material = value.key;
    this.sharedMenuObservableService.input_keyword.next(material.key);
    this.sharedMenuObservableService.material.next(material.key);
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
    this.dialogRef.close();
  }
}
