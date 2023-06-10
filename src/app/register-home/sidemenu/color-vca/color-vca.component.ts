import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Colors } from 'src/app/register-home/core/constants/data-define';

interface IColor {
  name: string;
  active: boolean;
  selected: boolean;
  value: string;
}
@Component({
  selector: 'app-color-vca',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex_wrap">
      <button
        *ngFor="let color of aColors"
        type="button"
        class="box-size flex items-center justify-center cursor-pointer"
        [ngClass]="{ sel_class: color.selected }"
        (click)="handleClick(color)"
        [style.background-color]="color.value"
        [style.color]="getContrastColor(color.value)"
      >
        {{ color.name }}
      </button>
    </div>
    <div class="flex justify-center">
      <div
        *ngFor="let color of nColors; let i = index"
        class="flex flex-col items-center justify-center m-2"
      >
        <span class="text-sm text-blue-600 mr-2">{{ color.name }}</span>
        <div
          [style.background-color]="color.value"
          class="h-9 w-9 rounded-full"
        ></div>
        <!-- <input type="number" class="w-16 text-center" [formControlName]="i" placeholder="Qty" /> -->
      </div>
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
        padding: 0.2rem;
        height: 2rem;
        margin: 0.2rem;
        border: 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 0.25rem;
      }
      .sel_class {
        border: 4px solid #2962ff;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ColorVcaComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorVcaComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() selectedColor: string[];
  @Input() set reset_color(value: boolean) {
    if (value) {
      this.initialize_color();
    }
  }
  selectedColorIndex: number[] = [];

  aColors: IColor[] = [];
  constructor(
    private cd: ChangeDetectorRef,
    private elRef: ElementRef,
  ) {}
  onChange: any = () => {};
  onTouch: any = () => {};
  favoritecolor: string | undefined;
  colors = Colors;
  selected_color: IColor[] = [];
  colorArray: string[] = [];
  nColors: { name: string; value: string }[] = [];

  ngOnInit(): void {
    this.initialize_color();
  }
  private initialize_color() {
    const acolor = this.colors.map((color) => ({
      name: color.key,
      active: false,
      selected: false,
      value: color.value,
    }));
    this.aColors = acolor;
  }
  ngOnChanges(): void {
    console.log('selectedColor', this.selectedColor);
    this.setInitialValue();
    this.getColors();
    this.onChange(this.selectedColor);
    // this.onChange(this.aColors.filter((color) => color.selected === true));
  }
  private setInitialValue() {
    // console.log('selectedColor-1', value);
    this.selectedColorIndex = this.selectedColor.map((val) => {
      return this.colors.findIndex((color) => color.key === val);
    });
    this.aColors = this.colors.map((color, index) => ({
      name: color.key,
      active: this.selectedColorIndex.includes(index),
      selected: this.selectedColorIndex.includes(index),
      value: color.value,
    }));
    //console.log('selectedColor', this.selectedColorIndex);
    this.selectedColorIndex.forEach((index) => {
      const selectedButton: any =
        this.elRef.nativeElement.querySelectorAll('.box-size')[index];

      // 클릭 이벤트를 발생시킵니다.
      if (selectedButton) {
        selectedButton.click();
      }
    });
  }
  private getColors() {
    this.nColors = [];
    const tColors = this.aColors.filter((color) => color.selected === true);
    if (tColors.length > 0) {
      tColors.forEach((color: any) => {
        this.nColors.push({
          name: color.name,
          value: color.value,
        });
        this.cd.detectChanges();
      });
    }
  }

  toggleSize(color: IColor): void {
    color.active = !color.active;
    if (color.active) {
      color.selected = !color.selected;
      // color.element?.classList.add('bg-yellow-500');
    } else {
      color.selected = false;
      // color.element?.classList.remove('bg-yellow-500');
    }
    this.onChange(
      this.aColors
        .filter((color) => color.selected === true)
        .map((color) => color.name)
    );
    this.getColors();
  }
  handleSubmit(colors: IColor[]): void {
    const selectedcolors = colors.filter((color) => color.selected);
    console.log(selectedcolors);
  }

  handleClick(color: IColor): void {
    this.toggleSize(color);
  }

  handleSubmitClick(): void {
    this.handleSubmit(this.aColors);
  }
  selectValue(value: any) {
    // console.log('discount: ', value);
    // this.selected_color = value.key;
    // this.onChange(value.key);
  }

  writeValue(value: any): void {
    this.favoritecolor = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
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
