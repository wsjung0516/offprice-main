import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { Colors } from 'src/app/register-home/core/constants/data-define';
import { RegisterChipsKeywordService } from '../../core/services/register-chips-keyword.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ShowMenuDialogComponent } from '../show-menu-dialog-component/show-menu-dialog-component';
import { RegisterMenuObservableService } from '../../core/services/register-menu-observable.service';

@Component({
  selector: 'app-color',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule],
  template: `
    <div class="p-4 flex flex_wrap">
      <ng-container *ngFor="let color of colors">
        <button
          class="box-size flex items-center justify-center cursor-pointer"
          [ngClass]="{ sel_class: color.key === selected_color }"
          (click)="selectValue(color)"
          [style.background-color]="color.value"
          [style.color]="getContrastColor(color.value)"
        >
          {{ color.key }}
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
export class ColorComponent {
  @Input() dialogRef: MatDialogRef<ShowMenuDialogComponent>;
  colors: typeof Colors = Colors;
  selected_color: string | undefined;
  constructor(
    private registerChipsKeywordService: RegisterChipsKeywordService,
    private registerMenuObservableService: RegisterMenuObservableService
  ) {}
  selectValue(data: any) {
    const value = { key: 'colorsearch_period', value: data.key };
    this.registerMenuObservableService.input_keyword.next(data.key);
    this.registerMenuObservableService.color.next(data.key);
    this.registerChipsKeywordService.removeChipKeyword(value);
    this.registerChipsKeywordService.addChipKeyword(value);

    this.dialogRef.close();
  }
  hexToRgb(hex: string) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  getContrastColor(hex: string) {
    const { r, g, b } = this.hexToRgb(hex);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }
}
