import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  ViewChild,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MakeTableWhereConditionService } from 'src/app/core/services/make-table-where-condition.service';
import { Router, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserSaleListService } from 'src/app/modules/dashboard/components/sale-list/user-sale-list.service';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { Subject } from 'rxjs';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SearchKeyword } from 'src/app/core/services/chips-keyword.service';
import { MatIconModule } from '@angular/material/icon';
import { SaleListModule } from 'src/app/modules/dashboard/components/sale-list/sale-list.module';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
// import { CreatUserComponent } from './../../../../core/components/user-info/user-info.component';
import { CreateUserComponent } from 'src/app/user/create-user/create-user.component';
import { DialogConfig, DialogService } from '@ngneat/dialog';
import { User } from 'src/app/user/models/user.model';
import { DetailsItemComponent } from 'src/app/core/components/details-item/details-item.component';
import { AuthService } from 'src/app/auth/keycloak/auth.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { CartItemsComponent } from 'src/app/core/components/cart-items/cart-items.component';
import { CartItems } from 'src/app/core/models/cart-items.model';
import { CartItemsService } from 'src/app/core/components/cart-items/cart-items.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    SaleListModule,
    DetailsItemComponent,
    CartItemsComponent,
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
    'vendor',
    'price',
    'count',
    'description',
    'category',
    'size',
    'material',
    'created_at',
    'image_url',
    'store_name',
    'action',

    // 'action',
  ];
  displayedTitle: string[] = [
    // 'Id',
    'Vendor',
    'Price',
    'Quantity',
    'Description',
    'Category',
    'Size',
    'Material',
    'CreatedAt',
    'Image',
    'Store Name',
    'Detail',
  ];

  dataSource: MatTableDataSource<UserSaleList>;
  pageSize = 20;
  length = 100;
  disabled = false;
  mode: string;
  refreshObservable = new Subject();
  oldOrderBy: {} = {};
  keywords: SearchKeyword[] = [];
  userSaleLists: UserSaleList[] = [];
  userSaleList: UserSaleList;
  private dialogService = inject(DialogService);

  constructor(
    private makeTableWhereConditionService: MakeTableWhereConditionService,
    private userSaleListService: UserSaleListService,
    private router: Router,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private sessionStorageService: SessionStorageService,
    private cartItemService: CartItemsService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource(this.userSaleLists);
  }
  ngOnInit(): void {}
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
        this.localStorageService.setItem('searchItemsLength', res.toString());

        this.paginator.length = res;
        this.cd.detectChanges();
      });
  }

  getUserSaleList(id: string) {
    this.userSaleListService.getUserSaleList(id).subscribe((data: any) => {
      console.log(data);
    });
  }
  selectItem(row: UserSaleList) {
    // console.log('detailSaleItem', row);
    const userProfile = this.sessionStorageService.getItem('userProfile');
    if (!userProfile) {
      this.authService.login();
    }

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
    const userProfile:any = this.sessionStorageService.getItem('userProfile');
    if (!userProfile) {
      this.authService.login();
    }
    let data: Partial<CartItems> = {};
    data = {
      sale_list_id: +row.sale_list_id,
      quantity: 1,
    }
    this.cartItemService.addCartItem(data).subscribe((res: any) => {
      this.cartItemService.setCartItemsLength(userProfile.id);
      this.snackBar.open('Added to cart', 'Success', {
        duration: 2000})
    })
    // const dialogRef = this.dialogService
    //   .open(CartItemsComponent, {
    //     data: {},
    //     backdrop: false,
    //     //...config,
    //     // width: '800px',
    //     // height: '800px',
    //   })
    //   .afterClosed$.subscribe((data: any) => {
    //     if (data) {
    //       this.refreshObservable.next({}); // trigger the observable for updating the table}
    //     }
    //   });
  }
  ngOnDestroy(): void {
    console.log('table-list destroy');
    this.makeTableWhereConditionService.resetService();
  }
}
// make example data by using UserSaleList model
export const resetUserSaleList: Partial<UserSaleList> = {
  category: 'Tops',
  count: 100,
  // created_at:"2023-04-13T19:32:54.000Z",
  description:
    '<h1>Title</h1><p>1.test1</p><p>2.test2</p><p>3.test3</p><p>adkfjdasfkdasfdsafdasfdsafdasfdasfdasfasdfdsafasfasdfdasfasdfdsfdsafdasfsdafsd</p>',
  image_url:
    'https://offprice_bucket.storage.googleapis.com/263e8818-c66e-11ec-9c47-027098eb172b_E_1681414372510.jpg',
  material: 'Polyester',
  price: '100',
  register_no: '1234567890',
  representative_name: 'Junsu',
  representative_phone_no: '111-2222-3333',
  sale_list_id: '1032',
  size: 'XS',
  status1: null,
  status2: null,
  status3: null,
  store_address1: '3416 manning ave Apt3813',
  store_address2: null,
  store_city: '대방동',
  store_country: 'KR',
  store_name: 'ABC mart',
  store_state: '서울특별시',
  user_id: '25b85792-ac77-4433-97bb-a622e03f3241',
  vendor: 'BBB',
};

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
