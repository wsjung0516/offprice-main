import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Categories } from 'src/app/register-home/core/constants/data-define';
import { RegisterChipsKeywordService } from '../../core/services/register-chips-keyword.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ShowMenuDialogComponent } from '../show-menu-dialog-component/show-menu-dialog-component';
import { RegisterMenuObservableService } from '../../core/services/register-menu-observable.service';

@Component({
  selector: 'app-category-vca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 flex_wrap">
      <ng-container *ngFor="let category of categories">
        <button
          class="box-size flex items-center justify-center cursor-pointer"
          [ngClass]="{ sel_class: category.key === selected_category }"
          (click)="selectValue(category)"
        >
          {{ category.key }}
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
        height: 3rem;
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
export class CategoryComponent {
  @Input() dialogRef: MatDialogRef<ShowMenuDialogComponent>;
  constructor(
    private registerMenuObservableService: RegisterMenuObservableService,
    private registerChipsKeywordService: RegisterChipsKeywordService,
  ) {}
  categories = Categories;
  selected_category = '';

  selectValue(category: { key: string; value: string }) {
    // console.log('category: ', value);
    const value = { key: 'category', value: category.key };
    this.selected_category = value.key;
    this.registerMenuObservableService.category.next(category.key);
    this.registerChipsKeywordService.removeChipKeyword(value);
    this.registerChipsKeywordService.addChipKeyword(value);
    this.dialogRef.close();
  }
}
