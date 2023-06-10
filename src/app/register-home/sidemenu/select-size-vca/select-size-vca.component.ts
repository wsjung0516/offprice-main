import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Sizes } from 'src/app/register-home/core/constants/data-define';
// import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';

interface ISize {
  name: string;
  active: boolean;
  selected: boolean;
  category: string;
}

@Component({
  selector: 'app-select-size-vca',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
    <form [formGroup]="sizeFormGroup">
      <div formArrayName="sizeArray">
        <div class="flex justify-center">
          <div *ngFor="let size of nSizes; let i = index"
            class="flex flex-col items-center justify-center m-2"
          >
            <span class="text-blue-600 font-semibold mr-2">{{ size.name }}</span>
            <input
              type="number"
              class="w-16 text-center"
              [formControlName]="i"
              placeholder="Qty"
            />
          </div>
        </div>
      </div>
    </form>
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
export class SelectSizeVcaComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input()selectedSize: string[];
  @Input()sizeArrayData: string[];

  @Input() set reset_size(value: boolean) {
    if (value) {
      this.initializeSize();
    }
  }
  selectedSizeIndex: number[] = [];
  aSizes: ISize[] = [];
  nSizes: { name: string; value: number }[] = [];
  sizeArray: string[] = [];
  sizeFormGroup: FormGroup;
  
  constructor(private cd: ChangeDetectorRef,
     private elRef: ElementRef,
     private fb: FormBuilder) {
      this.sizeFormGroup = this.fb.group({
        sizeArray: this.fb.array(this.createSizeFormControls()),
       });
    }
  
  onChange: any = () => {};
  onTouch: any = () => {};
  sizes: any[] = Sizes;
  sizeValue: string[] = [];
  selected_size: string[] = [];
  ngOnInit(): void {
    this.initializeSize();
    this.sizeFormGroup.get('sizeArray').valueChanges.subscribe((value) => {
      this.sizeArray = value;
       // console.log('sizeArray----', this.sizeArray);
       this.onChange({size: this.sizeValue, sizeArray:value});

    });

  }
  ngOnChanges(): void {
    // console.log('this.selectedSize', this.selectedSize);
    if (this.selectedSize && this.selectedSize.length > 0 && this.sizeArrayData && this.sizeArrayData.length > 0) {
      this.setInitialValue(this.selectedSize, this.sizeArrayData);
      const size = this.aSizes.filter((size) => size.selected === true).map((size) => size.name);
      const sizeArray = this.sizeArrayData;
      this.onChange({size, sizeArray});
    }
  }

  private initializeSize() {
    const asize = this.sizes.map((size) => ({
      name: size.value,
      active: false,
      selected: false,
      category: size.category,
    }));
    this.aSizes = asize;
    this.nSizes = [];
    // Upload to the parent component (register-home.component.ts)
    this.sizeFormGroup.get('sizeArray').reset();
  }
  private setInitialValue(value: string[], sizeData: string[]) {
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
      const selectedButton: any = this.elRef.nativeElement.querySelectorAll('.box-size')[index];

      // 클릭 이벤트를 발생시킨다.
      if (selectedButton) {
        selectedButton.click();
      }
    });

    if (value?.length > 0) {
      // Display the size name and value
      this.showSizeNameNSizeData(value, sizeData);
    }
  }

  private showSizeNameNSizeData(value: string[], sizeData: string[]) {
    this.nSizes = [];
    value.forEach((element: any, index) => {
      this.nSizes.push({ name: element, value: 0 });
    });
    // Display the sizeArray data
    let element: string[] = [];
    // 사이즈의 종류를 20개 이상으로 선택하지 않을 것으로 가정한다.
    for (let i = 0; i < 20; i++) {
      element[i] = i < sizeData.length ? sizeData[i] : '';
    }
    const sizeArrayControl = this.sizeFormGroup.get('sizeArray');
    if (sizeArrayControl) {
      sizeArrayControl.reset();
      sizeArrayControl.setValue(element);
    }
    this.cd.detectChanges();
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
    const sizes = this.aSizes.filter((size) => size.selected === true).map((size) => size.name);
    this.sizeValue = sizes;
    const sizeArray = this.sizeArray;
    this.showSizeNameNSizeData(sizes, sizeArray);
    // this.onChange({size:sizes, sizeArray});
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
  private createSizeFormControls(): FormControl[] {
    const formControls: FormControl[] = [];
    // 사이즈의 종류를 20개 이상으로 선택하지 않을 것으로 가정한다.
    // 20개를 미리 생성했다.
    for (let i = 0; i < 20; i++) {
      formControls.push(this.fb.control(''));
    }
    return formControls;
  }

}
