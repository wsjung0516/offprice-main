import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  Subscription,
} from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import {
  MatDialogModule,
  MatDialog,
  DialogPosition,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ShowMenuDialogComponent } from '../sidemenu/show-menu-dialog-component/show-menu-dialog-component';
import { MaterialComponent } from '../sidemenu/material/material.component';
import { ComponentType } from '@angular/cdk/portal';
import { PriceRangeComponent } from '../sidemenu/price-range/price-range.component';
import { SelectSizeComponent } from '../sidemenu/select-size/select-size.component';
import { CategoryComponent } from '../sidemenu/category/category.component';
import { SearchPeriodComponent } from '../sidemenu/search-period/search-period.component';
import { ColorComponent } from '../sidemenu/color/color.component';
import {
  SearchKeyword,
  RegisterChipsKeywordService,
} from '../core/services/register-chips-keyword.service';
// import { ChipListComponent } from './chip-list/chip-list.component';
import { TableListComponent } from '../table-list/table-list.component';
import { RegisterMenuObservableService } from '../core/services/register-menu-observable.service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { RegisterRemoveChipsKeywordService } from '../core/services/register-remove-chips-keyword.service';
import { RegisterInputKeywordComponent } from '../core/components/register-input-keyword/register-input-keyword.component';
import { Category1MenuComponent } from '../sidemenu/category1-menu/category1-menu.component';
import { CategoryMenuComponent } from '../sidemenu/category-menu/category-menu.component';
// import { ChipListComponent } from 'src/app/core/components/chip-list/chip-list.component';
@UntilDestroy()
@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [
  CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogComponent,
    MatDialogModule,
    ConfirmDialogComponent,
    MatChipsModule,
    // ChipListComponent,
    TableListComponent,
    RegisterInputKeywordComponent,
    ColorComponent,
    Category1MenuComponent,
    CategoryMenuComponent,
  ],
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleListComponent implements OnInit {
  selectedValue: FormControl;
  searchValue: FormControl;
  inputKeyword = '';
  keywords: SearchKeyword[] = [];
  dialogRef: MatDialogRef<ShowMenuDialogComponent> = null;

    // userForm: FormGroup;
  userForm = new FormGroup({
    selectedValue: new FormControl(''),
    searchValue: new FormControl(''),
    gender: new FormControl(''),
  });

  @ViewChild('vendor') vendor: ElementRef;
  @ViewChild('price') price: ElementRef;
  @ViewChild('category') category: ElementRef;
  @ViewChild('size') size: ElementRef;
  @ViewChild('material') material: ElementRef;
  @ViewChild('search_period') search_period: ElementRef;
  @ViewChild('color') color: ElementRef;

  constructor(
    private dialog: MatDialog,
    private registerMenuObservableService: RegisterMenuObservableService,
    private registerChipsKeywordService: RegisterChipsKeywordService,
    private cd: ChangeDetectorRef,
    private registerRemoveChipsKeywordService: RegisterRemoveChipsKeywordService
  ) {
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(this.saleLists);
  }
  ngOnInit(): void {
    this.registerMenuObservableService.reset_input_keyword$
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.reset();
      });
      this.subscribeToSearchKeywords();
  }

  onVendor() {}
  onPrice() {
    this.showSearchMenu(PriceRangeComponent, 'Price');
  }
  onCategory() {
    this.showSearchMenu(CategoryComponent, 'Category');
  }
  onSize() {
    this.showSearchMenu(SelectSizeComponent, 'Size');
  }
  onMaterial() {
    this.showSearchMenu(MaterialComponent, 'Material');
  }
  onColor() {
    this.showSearchMenu(ColorComponent, 'Color');
  }
  onSearchPeriod() {
    this.showSearchMenu(
      SearchPeriodComponent,
      'Search Period',
      '300px',
      '450px'
    );
  }
  subscribeToSearchKeywords(): void {
    this.registerChipsKeywordService.searchKeyword$
      .pipe(untilDestroyed(this))
      .subscribe((result: any[]) => {
        console.log('subscribeToSearchKeywords', result);
        this.keywords = result.filter(
          (obj) =>
            (obj.value !== '' && obj.key === 'input_keyword') ||
            (obj.value !== 'All' && obj.key !== 'input_keyword')
        );
        this.cd.detectChanges();
      });
  }
  // Display the dialog for selecting search condition for each menu
  showSearchMenu(
    component: ComponentType<any>,
    title: string,
    width = '300px',
    height = '400px'
  ) {

    this.dialogRef = this.dialog.open(ShowMenuDialogComponent, {
      data: {
        component: component,
        title: title,
      },
      width: width,
      height: height,
      hasBackdrop: true,
      panelClass: 'app-full-bleed-dialog',
      // panelClass: 'control-box-custom-dialog',
    });
    return this.dialogRef.afterClosed();
  }
  // inputKeyword: string = '';
  ngOnDestroy() {
  }
  reset() {
    this.inputKeyword = '';
    this.cd.detectChanges();
  }
  async removeChipsKeyword(keyword: SearchKeyword) {
    await this.registerRemoveChipsKeywordService.resetSearchKeyword(keyword);
    if (keyword['key'] === 'input_keyword') {
    }
  }

}
