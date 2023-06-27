import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Sizes } from 'src/app/core/constants/data-define';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DesignSizeMenuService } from './design-size-menu.service';
import { TippyDirective } from '@ngneat/helipopper';
// import { filter } from 'rxjs';

interface ISize {
  name: string;
  active: boolean;
  selected: boolean;
  category: string;
}

@Component({
  selector: 'app-design-size-menu',
  standalone: true,
  imports: [
  CommonModule,
    FormsModule, 
    ReactiveFormsModule, 
    MatIconModule,
    TippyDirective
  ],
  templateUrl: './design-size-menu.component.html',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignSizeMenuComponent implements OnInit, AfterViewInit {
  selectedSizes: string[] = [];
  
  selectedSizeIndex: number[] = [];
  aSizes: ISize[] = [];
  nSizes: { name: string; value: number }[] = [];
  sizeArray: string[] = [];
  sizeFormGroup: FormGroup;
  sizeSet = new Set();
  
  constructor(private cd: ChangeDetectorRef,
     private elRef: ElementRef,
     private fb: FormBuilder,
     private snackBar: MatSnackBar,
     private designSizeMenuService: DesignSizeMenuService) {
      this.sizeFormGroup = this.fb.group({
        sizeArray: this.fb.array(this.createSizeFormControls()),
       });
    }
  
  sizes: any[] = Sizes;
  sizeValue: string[] = [];
  selected_size: string[] = [];
  ngOnInit(): void {
    this.initializeSize();
    this.sizeFormGroup.get('sizeArray').valueChanges.subscribe((value) => {
      this.sizeArray = value;

    });
  }
  ngAfterViewInit(): void {
    this.designSizeMenuService.getMySize().subscribe((data: any) => {
      // console.log('getMyCategory: ', data);
      this.selectedSizes = data;
      this.cd.detectChanges();      
    });    // console.log('this.selectedSizes', this.selectedSizes);
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
    // console.log('sizes----', sizes);
    // this.onChange({size:sizes, sizeArray});
  }
  handleSubmit(sizes: ISize[]): void {
    const selectedSizes = sizes.filter((size) => size.selected);
    console.log(selectedSizes);
  }

  handleClick(size: ISize): void {
    this.toggleSize(size);
  }

  handleSubmitClick(): void {
    this.handleSubmit(this.aSizes);
  }

  removeSizeMenu(size: any) {
    const index = this.selectedSizes.indexOf(size);
    if (index > -1) {
      this.selectedSizes.splice(index, 1);
    }
  }
  onSizeHelp() {
    console.log('onSizeHelp');
  }
  onSaveSizeMenu() {
    // console.log('this.selectedSizes', this.selectedSizes);
    const categories = JSON.stringify(this.selectedSizes);
    this.designSizeMenuService.createMySize(categories).subscribe((data:any) => {
      // console.log('createMyCategory: ', data);
      this.snackBar.open('Category Menu Saved', 'Close', {
        duration: 2000,
      });
    });
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
  onAddSize() {
    const sizeArray = this.sizeArray.filter((val:any) => val !== '' && val !== null && val !== undefined);
    const size = this.sizeValue.join(',');
    const sizeArr = sizeArray.join(',');
    // console.log('sizeSet--', sizeArr, sizeArray);
    const tsize = size + ': ' + sizeArr;
    this.selectedSizes.push(tsize);
    this.initializeSize();
  }
}
