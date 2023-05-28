import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentType } from '@angular/cdk/portal';
import { MaterialComponent } from 'src/app/register-home/sidemenu/material/material.component';
import { PriceRangeComponent } from 'src/app/register-home/sidemenu/price-range/price-range.component';
import { SelectSizeComponent } from 'src/app/register-home/sidemenu/select-size/select-size.component';
import { CategoryComponent } from 'src/app/register-home/sidemenu/category/category.component';
import { SearchPeriodComponent } from 'src/app/register-home/sidemenu/search-period/search-period.component';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChipsKeywordService } from 'src/app/core/services/chips-keyword.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  DialogPosition,
  MatDialogModule,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { ShowMenuDialogComponent } from 'src/app/register-home/sidemenu/show-menu-dialog-component/show-menu-dialog-component';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="ml-2">
      <form [formGroup]="userForm">
        <div class="">
          <div class="flex items-center sm:justify-start overflow-x-auto">
            <div class="">
              <div class="relative min-w-60 w-60">
                <ng-container
                  *ngTemplateOutlet="showInputButton"
                ></ng-container>
              </div>
            </div>
            <div
              (click)="onVendor()"
              #vendor
              class="ml-2 p-2 w-auto h-10 rounded border-2 border-gray-600 text-md items-center flex justify-center cursor-pointer hover:bg-blue-300"
            >
              Vendor
            </div>
            <div
              (click)="onPrice()"
              #price
              class="ml-2 p-2 w-auto h-10 rounded border-2 border-gray-600 text-md items-center flex justify-center cursor-pointer hover:bg-blue-300"
            >
              Price
            </div>
            <div
              (click)="onCategory()"
              #category
              class="ml-2 p-2 w-auto h-10 rounded border-2 border-gray-600 text-md items-center flex justify-center cursor-pointer hover:bg-blue-300"
            >
              Category
            </div>
            <div
              (click)="onSize()"
              #size
              class="ml-2 p-2 w-auto h-10 rounded border-2 border-gray-600 text-md items-center flex justify-center cursor-pointer hover:bg-blue-300"
            >
              Size
            </div>
            <div
              (click)="onMaterial()"
              #material
              class="ml-2 p-2 w-auto h-10 rounded border-2 border-gray-600 text-md items-center flex justify-center cursor-pointer hover:bg-blue-300"
            >
              Material
            </div>
            <div
              (click)="onSearchPeriod()"
              #search_period
              class="ml-2 p-2 w-auto h-10 rounded border-2 border-gray-600 text-md items-center flex justify-center cursor-pointer hover:bg-blue-300"
            >
              Search_Period
            </div>
          </div>
        </div>
      </form>
    </div>
    <ng-template #showInputButton>
      <div
        class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
      ></div>
      <input
        type="search"
        #inputSearch
        [(ngModel)]="inputKeyword"
        id="default-search"
        class="block p-4 w-full  text-gray-900 bg-gray-50 rounded-lg border border-gray-500 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search"
        required
      />
      <button
        type="submit"
        class="text-white absolute right-1 bottom-1.5 bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        (click)="onSearchKeyword(inputSearch.value)"
      >
        <mat-icon>search</mat-icon>
      </button>
    </ng-template>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MenuListComponent implements OnInit {
  inputKeyword: string;
  userForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    private sharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService,
    private cd: ChangeDetectorRef
  ) {}
  @ViewChild('vendor') vendor: ElementRef;
  @ViewChild('price') price: ElementRef;
  @ViewChild('category') category: ElementRef;
  @ViewChild('size') size: ElementRef;
  @ViewChild('material') material: ElementRef;
  @ViewChild('search_period') search_period: ElementRef;
  ngOnInit(): void {
    this.userForm = new FormGroup({
      selectedValue: new FormControl(''),
      searchValue: new FormControl(''),
    });
  }

  onVendor() {}
  onPrice() {
    this.showSearchMenu(PriceRangeComponent, 'Price', '300px', '350px');
  }
  onCategory() {
    this.showSearchMenu(CategoryComponent, 'Category', '300px', '300px');
  }
  onSize() {
    this.showSearchMenu(SelectSizeComponent, 'Size', '300px', '300px');
  }
  onMaterial() {
    this.showSearchMenu(MaterialComponent, 'Material', '300px', '300px');
  }
  onSearchPeriod() {
    this.showSearchMenu(
      SearchPeriodComponent,
      'Search Period',
      '300px',
      '450px'
    );
  }
  showSearchMenu(
    component: ComponentType<any>,
    title: string,
    width = '300px',
    height = '400px'
  ) {
    const rect = this.vendor.nativeElement.getBoundingClientRect();
    const position: DialogPosition = {
      left: Math.round(rect.left + 50) + 'px',
      top: Math.round(rect.top + 50) + 'px',
    };

    this.dialogRef = this.dialog.open(ShowMenuDialogComponent, {
      data: {
        component: component,
        title: title,
      },
      width: width,
      height: height,
      // position: position,
      hasBackdrop: true,
      panelClass: 'app-full-bleed-dialog',
      // panelClass: 'control-box-custom-dialog',
    });
    return this.dialogRef.afterClosed();
  }
  dialogRef: MatDialogRef<ShowMenuDialogComponent> = null;
  onSearchKeyword(val: string) {
    this.sharedMenuObservableService.keywords.next(val);
    const value = { key: 'keyword', value: val };
    this.chipsKeywordService.removeChipKeyword(value);
    this.chipsKeywordService.addChipKeyword(value);
  }
}
