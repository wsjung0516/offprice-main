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
  ChipsKeywordService,
} from 'src/app/core/services/chips-keyword.service';
// import { ChipListComponent } from './chip-list/chip-list.component';
import { TableListComponent } from '../table-list/table-list.component';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { RemoveChipsKeywordService } from 'src/app/core/services/remove-chips-keyword.service';
import { InputKeywordComponent } from 'src/app/modules/layout/components/sidebar/input-keyword/input-keyword.component';
import { Category1MenuComponent } from 'src/app/modules/layout/components/sidebar/category1-menu/category1-menu.component';
import { CategoryMenuComponent } from 'src/app/modules/layout/components/sidebar/category-menu/category-menu.component';
import { ResetSearchConditionsComponent } from 'src/app/core/components/reset-search-conditions/reset-search-conditions.component';
import { Title } from '@angular/platform-browser';
import { LocalStorageService } from '../core/services/local-storage.service';
import { SaleListService } from './sale-list.service';
import { UserSaleListService } from './user-sale-list.service';
import { MakeTableWhereConditionService } from 'src/app/core/services/make-table-where-condition.service';
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
    InputKeywordComponent,
    ColorComponent,
    Category1MenuComponent,
    CategoryMenuComponent,
    ResetSearchConditionsComponent,
  ],
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleListComponent implements OnInit, AfterViewInit {
  selectedValue: FormControl;
  searchValue: FormControl;
  inputKeyword = '';
  searchItemLength: number = 0;
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
    private sharedMenuObservableService: SharedMenuObservableService,
    private chipsKeywordService: ChipsKeywordService,
    private cd: ChangeDetectorRef,
    private removeChipsKeywordService: RemoveChipsKeywordService,
    private titleService: Title,
    private localStorageService: LocalStorageService,
    private userSaleListService: UserSaleListService,
    private makeTableWhereConditionService: MakeTableWhereConditionService
  ) {
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(this.saleLists);
  }
  ngOnInit(): void {
    this.sharedMenuObservableService.resetSearchConditions$
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.resetAllConditions();
      });
    this.sharedMenuObservableService.reset_input_keyword$
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.reset();
      });
    this.subscribeToSearchKeywords();
    this.subscribeToLocalStorageItem();

  }
  ngAfterViewInit() {
    this.titleService.setTitle('SaleList');
    this.makeTableWhereConditionService.searchResult$
      .pipe(untilDestroyed(this))
      .subscribe((data: any) => {
        // console.log('condition$', data);
        this.getConditionalUserSaleListLength();
      });
  }
  private getConditionalUserSaleListLength() {
    this.userSaleListService
      .getConditionalUserSaleListLength()
      .subscribe((res: number) => {
        // console.log('getConditionalSaleListLength', res);
        // To display the number of search results in the search bar
        this.localStorageService.setItem('searchItemsLength', res.toString());
        this.cd.detectChanges();
      });
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
    this.chipsKeywordService.searchKeyword$
      .pipe(untilDestroyed(this))
      .subscribe((result: any[]) => {
        // console.log('subscribeToSearchKeywords', result);
        this.keywords = result.filter(
          (obj) =>
            (obj.value !== '' && obj.key === 'input_keyword') ||
            (obj.value !== 'All' && obj.key !== 'input_keyword')
        );
        this.cd.detectChanges();
      });
  }
  subscribeToLocalStorageItem(): void {
    this.localStorageService.storageItem$
      .pipe(untilDestroyed(this))
      .subscribe((item) => {
        if (item && item.key === 'searchItemsLength') {
          this.searchItemLength = +item.value;
          this.cd.detectChanges();
        }
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
  private resetAllConditions() {
    //this.chipsKeywordService.resetSearchKeyword();

    const service = this.sharedMenuObservableService;
    const filters: any[] = [
      //   { name: 'vendor', subject: service.vendor, defaultValue: 'All' },
      {
        reset: service.reset_input_keyword,
        name: 'input_keyword',
        subject: service.input_keyword,
        defaultValue: '',
      },
      {
        reset: service.reset_price,
        name: 'price',
        subject: service.price,
        defaultValue: 'All',
      },
      {
        reset: service.reset_category,
        name: 'category',
        subject: service.category,
        defaultValue: 'All',
      },
      {
        reset: service.reset_size,
        name: 'size',
        subject: service.size,
        defaultValue: 'All',
      },
      {
        reset: service.reset_material,
        name: 'material',
        subject: service.material,
        defaultValue: 'All',
      },
      {
        reset: service.reset_search_period,
        name: 'search_period',
        subject: service.search_period,
        defaultValue: 'All',
      },
      {
        reset: service.reset_color,
        name: 'color',
        subject: service.color,
        defaultValue: 'All',
      },
    ];
    filters.forEach((filter) => {
      const { subject, defaultValue, name } = filter;
      // console.log('subject', subject.value, name)
      if (subject.value !== defaultValue) {
        filter.reset.next({});
        this.removeChipsKeywordService.resetSearchKeyword({
          key: name,
          value: '',
        });
      }
    });
  }

  ngOnDestroy() {}
  reset() {
    this.inputKeyword = '';
    this.cd.detectChanges();
  }
  async removeChipsKeyword(keyword: SearchKeyword) {
    await this.removeChipsKeywordService.resetSearchKeyword(keyword);
    if (keyword['key'] === 'input_keyword') {
    }
  }
}
