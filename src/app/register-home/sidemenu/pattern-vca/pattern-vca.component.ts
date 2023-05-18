import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { EPattern } from 'src/app/register-home/core/constants/data-define';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-patten-vca',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, FormsModule],
  template: `
    <div class="discount-radio-group">
      <mat-checkbox
        class=""
        *ngFor="let pattern of patterns | keyvalue"
        (change)="selectValue(pattern)"
        >{{ pattern.value }}
      </mat-checkbox>
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PatternVcaComponent,
      multi: true,
    },
  ],
})
export class PatternVcaComponent implements ControlValueAccessor {
  constructor() {}
  onChange: any = () => {};
  onTouch: any = () => {};
  patterns: typeof EPattern = EPattern;
  favoritePattern: string = '';

  selectValue(value: any) {
    console.log('discount: ', value);
    this.favoritePattern = value;
    this.onChange(value);
  }

  writeValue(value: any): void {
    this.favoritePattern = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
