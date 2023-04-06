import { ChangeDetectionStrategy, Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MakeTableWhereConditionService } from 'src/app/core/services/make-table-where-condition.service';
import { Router, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SaleListService } from 'src/app/modules/dashboard/components/sale-list/sale-list.service' ;
import { SaleList } from 'src/app/core/models/sale-list.model';
import { Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { SearchKeyword } from 'src/app/core/services/chips-keyword.service';
import { MatIconModule } from '@angular/material/icon';
import { SaleListModule } from 'src/app/modules/dashboard/components/sale-list/sale-list.module';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

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
    'updated_at',
    // 'created_at',
    'image_url',
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
    // 'Action',
  ];

  dataSource: MatTableDataSource<SaleList>;
  pageSize = 20;
  length = 100;
  disabled = false;
  mode: string;
  refreshObservable = new Subject();
  oldOrderBy: {} = {};
  keywords: SearchKeyword[] = [];
  saleLists: SaleList[] = [];
  saleList: SaleList;

  constructor(
    private makeTableWhereConditionService: MakeTableWhereConditionService,
    private saleListService: SaleListService,
    private router: Router,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private localStorageService: LocalStorageService
  ) {
    this.dataSource = new MatTableDataSource(this.saleLists);
  }
  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.makeTableWhereConditionService.initializeWhereCondition(this.sort, this.paginator);
    this.makeTableWhereConditionService.setRefreshObservable(this.refreshObservable);
    // 
    this.makeTableWhereConditionService.searchResult$
    .pipe(untilDestroyed(this))
    .subscribe((data: SaleList[]) => {
      // console.log('condition$', data)
      this.dataSource.sort = this.sort;
      this.dataSource.data = data;
      this.getConditionalSaleListLength();
      this.cd.detectChanges();

    })  

  }
  private getConditionalSaleListLength() {
    this.saleListService
      .getConditionalSaleListLength()
      .subscribe((res: number) => {
        // console.log('getConditionalSaleListLength', res);
        // To display the number of search results in the search bar
        this.localStorageService.setItem('searchItemsLength', res.toString());

        this.paginator.length = res;
        this.cd.detectChanges();
      });
  }

  getSaleList(id: string) {
    this.saleListService.getSaleList(id).subscribe((data: any) => {
      console.log(data);
    });
  }
}
