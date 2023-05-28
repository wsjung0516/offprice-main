import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sizes } from 'src/app/register-home/core/constants/data-define';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ShowMenuDialogComponent } from '../show-menu-dialog-component/show-menu-dialog-component';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';

@Component({
  selector: 'app-select-size-vca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 flex_wrap">
      <ng-container *ngFor="let size of sizes">
        <button
          class="box-size flex items-center justify-center cursor-pointer"
          [ngClass]="{
            sel_class: size.key === selected_size,
            'bg-blue-200': size.category === 'US',
            'bg-green-200': size.category === 'KR'
          }"
          (click)="selectSize(size)"
        >
          {{ size.key }}
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
        height: 2.5rem;
        margin: 0.25rem;
        padding: 0.5rem;
        border: 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 0.25rem;
      }
      .sel_class {
        background-color: #2962ff;
        color: white;
      }
      .bg-green-200 {
        background-color: #bbf7d0;
      }
      .bg-blue-200 {
        background-color: #bfdbfe;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSizeComponent {
  @Input() dialogRef: MatDialogRef<ShowMenuDialogComponent>;

  sizes = Sizes;
  selected_size: string = '';
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService
  ) {}

  selectSize(size: { key: string; value: string }) {
    // console.log(size);
    const value = { key: 'size', value: size.key };
    this.selected_size = size.key;
    this.sharedMenuObservableService.input_keyword.next(size.key);
    // this.sharedMenuObservableService.size.next(size.key);
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
    this.dialogRef.close();
  }
}
