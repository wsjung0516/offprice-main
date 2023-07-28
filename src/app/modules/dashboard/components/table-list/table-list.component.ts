import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { SearchKeyword } from 'src/app/core/services/chips-keyword.service';
import { MakeTableWhereConditionService } from 'src/app/core/services/make-table-where-condition.service';
import { UserSaleListService } from 'src/app/modules/dashboard/components/sale-list/user-sale-list.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
// import { CreatUserComponent } from './../../../../core/components/user-profile-info/user-profile-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from '@ngneat/dialog';
import { CartItemsComponent } from 'src/app/core/components/cart-items/cart-items.component';
import { CartItemsService } from 'src/app/core/components/cart-items/cart-items.service';
import { DetailsItemComponent } from 'src/app/core/components/details-item/details-item.component';
import { DescriptionDetailDirective } from 'src/app/core/directives/description-detail.directive';
import { ImageDetailDirective } from 'src/app/core/directives/image-detail.directive';
import { CartItems } from 'src/app/core/models/cart-items.model';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { UserTokenService } from 'src/app/core/services/user-token.service';
import { User } from 'src/app/user/models/user.model';

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
    MatDialogModule,
    ConfirmDialogComponent,
    DetailsItemComponent,
    CartItemsComponent,
    DescriptionDetailDirective,
    ImageDetailDirective,
  ],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MakeTableWhereConditionService, UserSaleListService],
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
    'store_name',
    'action',

    // 'action',
  ];
  displayedTitle: string[] = [
    // 'Id',
    'Product Name',
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
    'Store Name',
    'Details',
  ];

  dataSource: MatTableDataSource<UserSaleList>;
  pageSize = 20;
  length = 100;
  disabled = false;
  mode: string;
  refreshObservable = new Subject();
  oldOrderBy: {} = {};
  keywords: SearchKeyword[] = [];
  // userSaleLists: UserSaleList[] = [];
  userSaleList: UserSaleList;
  private dialogService = inject(DialogService);

  constructor(
    private makeTableWhereConditionService: MakeTableWhereConditionService,
    private userSaleListService: UserSaleListService,
    private router: Router,
    private cartItemService: CartItemsService,
    private snackBar: MatSnackBar,
    private userTokenService: UserTokenService
  ) {
    this.dataSource = new MatTableDataSource(this.userSaleLists());
    effect(() => {
      this.dataSource.data = this.userSaleLists();
      if( this.paginator ) {
        this.paginator.length = this.conditionalUserSaleListLength();
      }
      this.dataSource.sort = this.sort;

    });
  }
  ngOnInit(): void {
    // console.log('table-list init');
  }
  userSaleLists = this.makeTableWhereConditionService.userSaleLists;
  conditionalUserSaleListLength = this.userSaleListService.conditionalUserSaleListLength;

  ngAfterViewInit(): void {
    // console.log('table-list afterviewinit');
    this.makeTableWhereConditionService.initializeWhereCondition(
      this.sort,
      this.paginator
    );
    this.makeTableWhereConditionService.setRefreshObservable(
      this.refreshObservable
    );
    //
  }
  trackByFn(index: number, item: UserSaleList) {
    return item.sale_list_id;
  }
  // getUserSaleList(id: string) {
  //   this.userSaleListService.getUserSaleList(id).subscribe((data: any) => {
  //     // console.log(data);
  //   });
  // }
  selectItem(row: UserSaleList) {
    // console.log('detailSaleItem', row);

    const mobileMode = window.matchMedia('(max-width: 576px)').matches;
    const width = mobileMode ? '100%' : '58%';
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
  putIntoCart(row: Partial<UserSaleList>) {
    /*     const userProfile: any = this.sessionStorageService.getItem('token');
    if (!userProfile.user) {
      this.router.navigate(['/login']);
      return;
    }
 */
    this.userTokenService.getUserToken().subscribe((userProfile: any) => {
      if (!userProfile) {
        this.router.navigate(['/login']);
        return;
      } else {
        let data: Partial<CartItems> = {};
        data = {
          sale_list_id: +row.sale_list_id,
          quantity: 1,
        };
        this.cartItemService.addCartItem(data).subscribe((res: any) => {
          // this.cartItemService.displayCartItemsLength(userProfile.user.uid);
          this.snackBar.open('Added to cart', 'Success', {
            duration: 2000,
          });
        });
      }
    });
  }
  ngOnDestroy(): void {
    console.log('table-list destroy');
  }
}

export const resetUser: User = {
  user_id: '1', // string 1
  first_name: '', // string 'John'
  last_name: '', // string 'John'
  email: '', // string ''
  bod: null, // Date,
  gender: '', // string,
  zipcode: '', // string,
  phone_no: '', // string,
  address1: '', // string,
  address2: '', // string,
  point: 0, // number,
  status: '', // string,
  created_at: null, // Date,
  subscribe: null, // boolean,
};
