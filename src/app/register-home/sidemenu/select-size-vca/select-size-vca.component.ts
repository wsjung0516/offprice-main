import {
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
import { Sizes } from 'src/app/register-home/core/constants/data-define';
import { untilDestroyed } from '@ngneat/until-destroy';
import { pipe } from 'rxjs';
// import { RegisterMenuObservableService } from '../../core/services/register-menu-observable.service';
interface ISize {
  name: string;
  active: boolean;
  selected: boolean;
  category: string;
}

@Component({
  selector: 'app-select-size-vca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex_wrap">
      <button
        *ngFor="let size of aSizes"
        type="button"
        class="box-size flex items-center justify-center cursor-pointer"
        [ngClass]="{
          sel_class: size.selected,
          'bg-blue-200': size.category === 'US',
          'bg-green-200': size.category === 'KR'
        }"
        (click)="handleClick(size)"
      >
        {{ size.name }}
      </button>
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
        height: 2.0rem;
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
      .bg-green-200 {
        background-color: #bbf7d0;
      }
      .bg-blue-200 {
        background-color: #bfdbfe;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectSizeVcaComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSizeVcaComponent implements ControlValueAccessor, OnInit {
  @Input() set selectedSize(value: string[]) {
    this.selectedSizeIndex = value.map((val) => {
      return this.sizes.findIndex((size) => size.key === val);
    });
    this.aSizes = this.sizes.map((size, index) => ({
      name: size.key,
      active: this.selectedSizeIndex.includes(index),
      selected: this.selectedSizeIndex.includes(index),
      category: size.category,
    }));
    // console.log('selectedSize', this.selectedSizeIndex);
    this.selectedSizeIndex.forEach((index) => {
      const selectedButton: any =
        this.elRef.nativeElement.querySelectorAll('.box-size')[index];

      // 클릭 이벤트를 발생시킵니다.
      if (selectedButton) {
        selectedButton.click();
      }
    });
  }
  @Input() set reset_size(value: boolean) {
    if (value) {
      this.initializeSize();
    }
  }
  selectedSizeIndex: number[] = [];
  aSizes: ISize[] = [];
  constructor(private cd: ChangeDetectorRef, private elRef: ElementRef) {}
  onChange: any = () => {};
  onTouch: any = () => {};
  sizes: any[] = Sizes;
  selected_size: string[] = [];
  ngOnInit(): void {
    this.initializeSize();
  }

  private initializeSize() {
    const asize = this.sizes.map((size) => ({
      name: size.value,
      active: false,
      selected: false,
      category: size.category,
    }));
    this.aSizes = asize;
  }

  toggleSize(size: ISize): void {
    size.active = !size.active;
    if (size.active) {
      size.selected = !size.selected;
      // size.element?.classList.add('bg-yellow-500');
    } else {
      size.selected = false;
      // size.element?.classList.remove('bg-yellow-500');
    }
    // console.log('this.onChange(this.aSizes);', this.onChange);
    this.onChange(this.aSizes.filter((size) => size.selected === true));
  }
  handleSubmit(sizes: ISize[]): void {
    const selectedSizes = sizes.filter((size) => size.selected);
    // console.log(selectedSizes);
  }

  handleClick(size: ISize): void {
    this.toggleSize(size);
  }

  handleSubmitClick(): void {
    this.handleSubmit(this.aSizes);
  }

  selectSize(size: any) {
    // console.log(size);
    // this.selected_size = size.key;
    //this.onChange(this.aSizes);
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
