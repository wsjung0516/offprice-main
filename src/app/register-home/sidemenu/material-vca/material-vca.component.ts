import { ChangeDetectorRef, Component, ElementRef, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { EMaterial } from 'src/app/register-home/core/constants/data-define';
import { MatCheckboxModule } from '@angular/material/checkbox';
interface IMaterial {
  name: string;
  active: boolean;
  selected: boolean;
}
@Component({
  selector: 'app-material-vca',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule],
  template: `
    <div class="flex_wrap">
      <button
        *ngFor="let material of aMaterials"
        type="button"
        class="box-material flex items-center justify-center cursor-pointer"
        [ngClass]="{'sel_class': material.selected}"
        (click)="handleClick(material)"
      >
        {{ material.name }}
      </button>

      <!-- <ng-container *ngFor="let material of materials">
        <button
          class="box-material flex items-center justify-center cursor-pointer"
          [ngClass]="{ sel_class: material.key === selected_material }"
          (click)="selectValue(material)"
        >
          {{ material.key }}
        </button>
      </ng-container> -->
    </div>
  `,
  styles: [
    `
      .flex_wrap {
        display: flex;
        flex-wrap: wrap;
      }

      .box-material {
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
        background-color: #2962ff;
        color: white;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MaterialVcaComponent,
      multi: true,
    },
  ],
})
export class MaterialVcaComponent implements ControlValueAccessor, OnInit {
  @Input() set selectedMaterial(value: string[]) {
    this.selectedMaterialIndex = value.map(val => {
      return this.materials.findIndex(material => material.key === val);
    });
    this.aMaterials = this.materials.map((material, index) => ({
      name: material.key,
      active: this.selectedMaterialIndex.includes(index),
      selected: this.selectedMaterialIndex.includes(index),
    }));
    // console.log('selectedMaterial', this.selectedMaterialIndex);
    this.selectedMaterialIndex.forEach(index => {
      const selectedButton:any = this.elRef.nativeElement.querySelectorAll('.box-material')[index];

      // 클릭 이벤트를 발생시킵니다.
      if (selectedButton) {
        selectedButton.click();
      }

    });
  }
  @Input() set reset_material(value: boolean) {
    if(value) {
      this.initializeMaterial();
    }
  }
  selectedMaterialIndex: number[] = [];
  aMaterials: IMaterial[] = [];
  constructor(private cd: ChangeDetectorRef,
    private elRef: ElementRef,
    ) {}

  onChange: any = () => {};
  onTouch: any = () => {};
  favoriteMaterial: string | undefined;
  materials = EMaterial;
  selected_material: string[] = [];
  checkedList: any[] = [];

  ngOnInit(): void {
    this.initializeMaterial();
  }
  private initializeMaterial() {
    const amaterial = this.materials.map((material) => ({
      name: material.value,
      active: false,
      selected: false
    }));
    this.aMaterials = amaterial;
  }

  togglematerial(material: IMaterial): void {
    material.active = !material.active;
    if (material.active) {
      material.selected = !material.selected;
      // material.element?.classList.add('bg-yellow-500');
    } else {
      material.selected = false;
      // material.element?.classList.remove('bg-yellow-500');
    }
    this.onChange(this.aMaterials.filter((material) => material.selected === true)
    .map((material) => material.name));
  }
  handleSubmit(materials: IMaterial[]): void {
    const selectedMaterials = materials.filter((material) => material.selected);
    console.log(selectedMaterials);
  }

  handleClick(material: IMaterial): void {
    this.togglematerial(material);
  }

  handleSubmitClick(): void {
    this.handleSubmit(this.aMaterials);
  }
  selectValue(value: any) {
    // console.log('discount: ', value);
    this.selected_material = value.key;
    // this.onChange(value.key);
  }

  writeValue(value: any): void {
    this.favoriteMaterial = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
