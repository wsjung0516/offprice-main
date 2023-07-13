import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, AfterViewInit, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SoldSaleList } from 'src/app/core/models/sale-list.model';
import { SEOService } from 'src/app/core/services/SEO.service';
import { SoldRecordsService } from './sold-records.service';

@Component({
  selector: 'app-sold-records',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: './sold-records.component.html',

  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoldRecordsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'product_name',
    'category',
    'price',
    'quantity',
    'created_at',
    'image_sm_urls',
    'status1',
    'action',
  ];
  displayedTitle: string[] = [
    // 'Id',
    'ProductName',
    'Category',
    'Price',
    'Quantity',
    'CreatedAt',
    'Image',
    'Status',
    'Action',
  ];

  dataSource: MatTableDataSource<SoldSaleList>;
  pageSize = 20;
  length = 100;

  constructor(
    private sEOService: SEOService,
    private soldRecordsService: SoldRecordsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.sEOService.updateTitle('closeout marketplace');
    this.sEOService.updateDescription('Take advantage of our clearance offers for fantastic deals on a wide range of products');

  }

  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    const orderBy = { created_at: 'desc' };
    this.soldRecordsService.getSoldRecords(0, 100, orderBy).subscribe((data) => {
      // console.log('getSoldRecords: ', data);
      this.dataSource = new MatTableDataSource<SoldSaleList>(data);
      this.length = data.length;
      this.cd.detectChanges();
    });
  }
  openDetailsItem(item: any): void {
    console.log('openDetailsItem: ', item);
  }
  trackByFn(index: number, item: any): any {
    return item.sold_sale_list_id || index;
  }

}
