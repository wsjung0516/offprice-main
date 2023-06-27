import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Sizes } from 'src/app/register-home/core/constants/data-define';
import { DesignSizeMenuService } from '../../core/components/design-size-menu/design-size-menu.service';

@Component({
  selector: 'app-select-size-vca',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
  <p><span class="text-md text-gray-500">Value: </span><span class="text-blue-600 font-bold">{{selected_size}}</span></p>
    <div class="flex flex-wrap">
      <ng-container *ngFor="let size of selectedSizes">
        <button class="mt-2 border border-blue-500 rounded-full px-2 mx-1 text-gray-500 hover:text-blue-600 focus:outline-none focus:border-blue-500 active:text-blue-500 button-group"
          [value]="size"
          (click)="selectSize(size)"
          >
          <div class="flex items-center">
            <span class="text-gray-700 hover:text-blue-600">{{size}}</span>
          </div>
        </button>
      </ng-container>
    </div>
  `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectSizeVcaComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSizeVcaComponent implements ControlValueAccessor, OnInit, OnChanges, AfterViewInit {
  @Input() init_size: string;
  @Input() init_sizeArray: string;
  @Input() reset_size: boolean;

  selectedSizes: string[] = [];
  
  constructor(private cd: ChangeDetectorRef,
     // private elRef: ElementRef,
     private designSizeMenuService: DesignSizeMenuService,
     ) {}
  
  onChange: any = () => {};
  onTouch: any = () => {};
  sizes: any[] = Sizes;
  selected_size: string = '';
  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.designSizeMenuService.getMySize().subscribe((data: any) => {
      // console.log('getMySize: ', data);
      this.selectedSizes = data;
      this.cd.detectChanges();      
    });    // console.log('this.selectedSizes', this.selectedSizes);
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes', changes);
    if (changes['reset_size'] && changes['reset_size'].currentValue) {
      this.selected_size = '';
    }
    if (changes['init_size'] && changes['init_size'].currentValue) {
      this.selected_size = changes['init_size'].currentValue + ': ' + changes['init_sizeArray'].currentValue;
      this.onChange({size: this.init_size, sizeArray: this.init_sizeArray});
    }
  }

  selectSize(size: string) {
    // console.log(size);
    const si = size.split(':');
    const sizes = si[0];
    const sizeArr = si[1].trim();
    // console.log(sizes, sizeArr);
    this.selected_size = size;
    this.onChange({size: sizes, sizeArray: sizeArr});
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