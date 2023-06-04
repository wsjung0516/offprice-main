import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { untilDestroyed } from '@ngneat/until-destroy';
import { pipe } from 'rxjs';
import { IStatus, Status } from 'src/app/core/constants/data-define';
// import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';

@Component({
  selector: 'app-status-vca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex_wrap">
      <ng-container *ngFor="let status of aStatus">
          <button
            type="button"
            class="box-size flex items-center justify-center cursor-pointer"
            (click)="onSelect(status)"
            [ngClass]="{ sel_class: selected_status.key === status.key}"
            >
            {{ status.key }} 
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
        height: 2rem;
        margin: 0.2rem;
        padding: 0.25rem;
        border: 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 0.25rem;
      }
      .sel_class {
        border-color: #2962ff;
        border-width: 4px;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: StatusVcaComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusVcaComponent implements ControlValueAccessor {
  @Input() set status1(value: IStatus) {
    this.selected_status = value;
  }
  aStatus = Status;
  constructor(private cd: ChangeDetectorRef, private elRef: ElementRef) {}
  onChange: any = () => {};
  onTouch: any = () => {};
  selected_status: IStatus;

  onSelect(status: IStatus) {
    // console.log('status: ', status);
    this.selected_status = status;
    this.onChange(this.selected_status);
  }

  writeValue(value: any): void {
    // this.priceRange = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
