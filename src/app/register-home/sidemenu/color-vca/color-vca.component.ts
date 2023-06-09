import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit, ChangeDetectorRef, ElementRef, Renderer2, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Colors } from 'src/app/register-home/core/constants/data-define';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface IColor {
  name: string;
  active: boolean;
  selected: boolean;
  value: string;
}
@Component({
  selector: 'app-color-vca',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule],
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
        height: 2.0rem;
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
  @Input() set selectedColor(value: string[]) {
    this.selectedColorIndex = value.map(val => {
      return this.colors.findIndex(color => color.key === val);
    });
    this.aColors = this.colors.map((color, index) => ({
      name: color.key,
      active: this.selectedColorIndex.includes(index),
      selected: this.selectedColorIndex.includes(index),
      value: color.value,
    }));
    //console.log('selectedColor', this.selectedColorIndex);
    this.selectedColorIndex.forEach(index => {
      const selectedButton:any = this.elRef.nativeElement.querySelectorAll('.box-size')[index];

      // 클릭 이벤트를 발생시킵니다.
      if (selectedButton) {
        selectedButton.click();
      }

    });
  }
  @Input() set reset_color(value: boolean) {
    if(value) {
      this.initialize_color();
    }
  }

  selectedColorIndex: number[] = [];

  aColors: IColor[] = [];
  constructor(private cd: ChangeDetectorRef,
    private elRef: ElementRef,
    ) {}
  onChange: any = () => {};
  onTouch: any = () => {};
  favoritecolor: string | undefined;
  colors = Colors;
  selected_color: IColor[] = [];

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
    this.onChange(this.aColors.filter((color) => color.selected === true));
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
    this.onChange(this.aColors.filter((color) => color.selected === true));
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
