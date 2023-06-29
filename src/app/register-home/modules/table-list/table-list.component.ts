import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MakeRegisterWhereConditionService } from '../../core/services/make-register-where-condition.service';
import { Router, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SaleListService } from 'src/app/register-home/modules/sale-list/sale-list.service';
import { SaleList } from 'src/app/core/models/sale-list.model';
// import { SaleList } from 'src/app/register-home/core/models/sale-list.model';
import { concatMap, from, Subject, switchMap } from 'rxjs';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SearchKeyword } from 'src/app/core/services/chips-keyword.service';
import { MatIconModule } from '@angular/material/icon';

// import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../core/components/confirm-dialog/confirm-dialog.component';
import { DetailsItemComponent } from '../../core/components/details-item/details-item.component';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { UserSaleListService } from '../sale-list/user-sale-list.service';
import { DialogService } from '@ngneat/dialog';
import { DescriptionDetailDirective } from 'src/app/core/directives/description-detail.directive';
import { ImageDetailDirective } from 'src/app/core/directives/image-detail.directive';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { DeleteSaleListItemService } from 'src/app/core/services/delete-sale-list-item.service';
import { Meta, Title } from '@angular/platform-browser';

@UntilDestroy()
@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    RouterModule,
    MatIconModule,
    // MatDialogModule,
    ConfirmDialogComponent,
    DescriptionDetailDirective,
    ImageDetailDirective,
  ],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MakeRegisterWhereConditionService],
})
export class TableListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'product_name',
    'vendor',
    'price',
    'color',
    'category',
    'size',
    'sizeArray',
    'material',
    'description',
    'created_at',
    'image_sm_urls',
    'status1',
    'action',
  ];
  displayedTitle: string[] = [
    // 'Id',
    'ProductName',
    'Vendor',
    'Price',
    'Color',
    'Category',
    'Size',
    'Quantity',
    'Material',
    'Description',
    'CreatedAt',
    'Image',
    'Status',
    'Action',
  ];

  dataSource: MatTableDataSource<UserSaleList>;
  pageSize = 20;
  length = 100;
  disabled = false;
  mode: string;
  oldOrderBy: {} = {};
  keywords: SearchKeyword[] = [];
  // saleLists: SaleList[] = [];
  userSaleLists: UserSaleList[] = [];
  // saleList: SaleList;
  userSaleList: UserSaleList;

  constructor(
    private makeRegisterWhereConditionService: MakeRegisterWhereConditionService,
    private userSaleListService: UserSaleListService,
    private saleListService: SaleListService,
    private router: Router,
    // private dialog: MatDialog,
    // private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private sessionStorageService: SessionStorageService,
    private deleteSaleListItemService: DeleteSaleListItemService,
    private metaTagService: Meta,
    private titleService: Title
  ) {
    this.dataSource = new MatTableDataSource(this.userSaleLists);
  }
  ngOnInit(): void {
    this.metaTagService.updateTag({
      name: 'description',
      content:
        'Take advantage of our clearance offers for fantastic deals on a wide range of products',
    });
    this.titleService.setTitle('closeout marketplace');
    // console.log('register-home table-list ngOnInit');
    this.sessionStorageService.setItem('displayMode', 'list');
  }
  ngAfterViewInit(): void {
    console.log('register-home table-list ngAfterViewInit');
    this.makeRegisterWhereConditionService.initializeWhereCondition(
      this.sort,
      this.paginator
    );

    this.makeRegisterWhereConditionService.searchResult$
      .pipe(untilDestroyed(this))
      .subscribe((data: UserSaleList[]) => {
        // console.log('searchResult$', data);
        this.dataSource.sort = this.sort;
        this.dataSource.data = data;
        this.getConditionalUserSaleListLength();
        this.cd.detectChanges();
      });
  }
  trackByFn(index: number, item: UserSaleList) {
    return item.sale_list_id;
  }
  private getConditionalUserSaleListLength() {
    this.userSaleListService
      .getConditionalUserSaleListLength()
      .subscribe((res: number) => {
        // console.log('register-home getConditionalSaleListLength', res);
        // To display the number of search results in the search bar

        this.paginator.length = res;
        this.cd.detectChanges();
      });
  }

  getUserSaleList(id: string) {
    this.userSaleListService.getUserSaleList(id).subscribe((data: any) => {
      // console.log(data);
    });
  }
  editSaleList(saleList: UserSaleList) {
    //
    // console.log('editSaleList', saleList);

    this.sessionStorageService.setItem('registerStatus', 'update');
    this.router
      .navigate(['/register-home/home/register', { id: saleList.sale_list_id }])
      .then();

    // this.cdr.detectChanges();
  }
  onDeletedSaleList(saleList: SaleList | string) {
    console.log('onDeletedSaleList', saleList);
    this.deleteSaleListItemService.delete(saleList);
  }
  openDetailsItem(row: UserSaleList) {
    const mobileMode = window.matchMedia('(max-width: 576px)').matches;
    const width = mobileMode ? '100%' : '58%';
    // console.log('openDetailsItem', row)
    const dialogRef = this.dialogService.open(DetailsItemComponent, {
      data: {
        data: row,
      },
      width,
      // height: 'auto',
    });

    dialogRef.afterClosed$.subscribe((result) => {
      if (result === 'save') {
        // check if the item is already saved.
      } else if (result === 'delete') {
      }
      console.log('The dialog was closed', result);
    });
  }
  // check if sale_list_id is already reserved in the table of CartItems
  isReserved(sale_list_id: string) {
    return this.saleListService.isReservedSaleItem(sale_list_id);
  }
  ngOnDestroy(): void {
    this.makeRegisterWhereConditionService.resetService();
  }
}
