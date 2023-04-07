import { ChangeDetectionStrategy, Component, AfterViewInit, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MakeTableWhereConditionService } from 'src/app/core/services/make-table-where-condition.service';
import { Router, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserSaleListService } from 'src/app/modules/dashboard/components/sale-list/user-sale-list.service' ;
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { SearchKeyword } from 'src/app/core/services/chips-keyword.service';
import { MatIconModule } from '@angular/material/icon';
import { SaleListModule } from 'src/app/modules/dashboard/components/sale-list/sale-list.module';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
// import { CreatUserComponent } from './../../../../core/components/user-info/user-info.component';
import { CreateUserComponent } from 'src/app/user/create-user/create-user.component';
import { DialogService } from '@ngneat/dialog';
import { User } from 'src/app/user/models/user.model';

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
    SaleListModule

  ],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableListComponent implements OnInit, AfterViewInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'vendor',
    'price',
    'count',
    'category',
    'size',
    'material',
    'created_at',
    'image_url',
    'first_name',
    'action'
    
    // 'action',
  ];
  displayedTitle: string[] = [
    // 'Id',
    'Vendor',
    'Price',
    'Count',
    'Category',
    'Size',
    'Material',
    'CreatedAt',
    'Image',
    'Name',
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
    private localStorageService: LocalStorageService
  ) {
    this.dataSource = new MatTableDataSource(this.userSaleLists);
  }
  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.makeTableWhereConditionService.initializeWhereCondition(this.sort, this.paginator);
    this.makeTableWhereConditionService.setRefreshObservable(this.refreshObservable);
    // 
    this.makeTableWhereConditionService.searchResult$
    .pipe(untilDestroyed(this))
    .subscribe((data: UserSaleList[]) => {
      console.log('condition$', data)
      this.dataSource.sort = this.sort;
      this.dataSource.data = data;
      this.getConditionalUserSaleListLength();
      this.cd.detectChanges();

    })  

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
  detailSaleItem(id: string) {
    const dialogRef = this.dialogService
      .open(CreateUserComponent, {
        data: {
          user: resetUser,
          disabled: false,
          mode: 'Create',
        },
      })
      .afterClosed$.subscribe((data: any) => {
        if (data) {
          this.refreshObservable.next({}); // trigger the observable for updating the table}
        }
      });
    // console.log('onCreatedUser', this.userForm.value);
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
