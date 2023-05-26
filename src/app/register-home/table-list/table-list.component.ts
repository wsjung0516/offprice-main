import { ChangeDetectionStrategy, Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MakeTableWhereConditionService } from 'src/app/register-home/core/services/make-table-where-condition.service';
import { Router, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SaleListService } from 'src/app/register-home/sale-list/sale-list.service';
import { SaleList } from 'src/app/core/models/sale-list.model';
// import { SaleList } from 'src/app/register-home/core/models/sale-list.model';
import { concatMap, from, Subject, switchMap } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { SearchKeyword } from '../core/services/chips-keyword.service';
import { MatIconModule } from '@angular/material/icon';

import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import { DetailsItemComponent } from '../core/components/details-item/details-item.component';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { UserSaleListService } from '../sale-list/user-sale-list.service';
import { DialogService } from '@ngneat/dialog';
import { DescriptionDetailDirective } from 'src/app/core/directives/description-detail.directive';
import { ImageDetailDirective } from 'src/app/core/directives/image-detail.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';

@UntilDestroy()
@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule,
MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    RouterModule,
    MatIconModule,
    MatDialogModule,
    ConfirmDialogComponent,
    DescriptionDetailDirective,
    ImageDetailDirective,
  ],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableListComponent implements OnInit, AfterViewInit{
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
    'image_urls',
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
    'Action',
  ];

  dataSource: MatTableDataSource<UserSaleList>;
  pageSize = 20;
  length = 100;
  disabled = false;
  mode: string;
  refreshObservable = new Subject();
  oldOrderBy: {} = {};
  keywords: SearchKeyword[] = [];
  // saleLists: SaleList[] = [];
  userSaleLists: UserSaleList[] = [];
  // saleList: SaleList;
  userSaleList: UserSaleList;

  constructor(
    private makeTableWhereConditionService: MakeTableWhereConditionService,
    // private makeWhereConditionService: MakeWhereConditionService,
    private userSaleListService: UserSaleListService,
    private saleListService: SaleListService,
    private router: Router,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private sharedMenuObservableService: SharedMenuObservableService
  ) {
    this.dataSource = new MatTableDataSource(this.userSaleLists);
  }
  ngOnInit(): void {
    console.log('table-list ngOnInit');
    localStorage.setItem('displayMode', 'list');
    this.sharedMenuObservableService.deleteSaleListItem$
    .pipe(untilDestroyed(this)).subscribe((sale_list_id: string) => {
      console.log('deleteSaleListItem$', sale_list_id);
      this.onDeletedSaleList(sale_list_id)
    });

  }
  ngAfterViewInit(): void {
    this.makeTableWhereConditionService.initializeWhereCondition(
      this.sort,
      this.paginator
    );
    this.makeTableWhereConditionService.setRefreshObservable(
      this.refreshObservable
    );
    //
    this.makeTableWhereConditionService.searchResult$
      .pipe(untilDestroyed(this))
      .subscribe((data: UserSaleList[]) => {
        // console.log('condition$', data);
        this.dataSource.sort = this.sort;
        this.dataSource.data = data;
        this.getConditionalUserSaleListLength();
        this.cd.detectChanges();
      });
  }
  private getConditionalUserSaleListLength() {
    this.userSaleListService
      .getConditionalUserSaleListLength()
      .subscribe((res: number) => {
        // console.log('getConditionalSaleListLength', res);
        // To display the number of search results in the search bar
        // this.localStorageService.setItem('searchItemsLength', res.toString());

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

    localStorage.setItem('registerStatus', 'update');
    this.router.navigate(['/register-home/home/register', { id: saleList.sale_list_id }]).then();

    // this.cdr.detectChanges();
  }
  onDeletedSaleList(saleList: SaleList | string) {
    console.log('onDeletedSaleList', saleList);
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Remove Sales List',
        message: 'Are you sure, you want to remove?',
      },
    });
    let saleListId: string;
    if (typeof saleList === 'string') {
      saleListId = saleList;
    } else {
      saleListId = saleList.sale_list_id;
    }
    confirmDialog.afterClosed().subscribe((result: any) => {
      if (result === true) {
        this.saleListService.deleteSaleList(saleListId).pipe(
          switchMap((data: SaleList) => {
            // Delete images from Google Cloud Storage
            const urls = data.image_urls.split(',');
            return from(urls).pipe(
              concatMap((url: string) => {
                const fileName = url.match(/.*\/(.+\..+)/)[1];
                // console.log('fileName---', fileName);
                return this.saleListService.deleteImageFromBucket(fileName);
              })
            );
          }),
          untilDestroyed(this)
        ).subscribe((data: any) => {
          // console.log('deleted---', data);
          this.sharedMenuObservableService.resultDeleteSaleListItem.next(saleListId);
          this.snackBar.open('Deleted Successfully', 'Close', {
            duration: 2000,
          });
          // this.refreshObservable.next();
        }, (error: any) => {
          this.snackBar.open('Deleting is failed because this item is reserved already by someone', 'Close', {
          });
        });
      }
    });
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
}
