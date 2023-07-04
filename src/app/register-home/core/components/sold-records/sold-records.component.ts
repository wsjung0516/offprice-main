import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SoldSaleList } from 'src/app/core/models/sale-list.model';
import { SEOService } from 'src/app/core/services/SEO.service';

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
  ) { }

  ngOnInit(): void {
    this.sEOService.updateTitle('closeout marketplace');
    this.sEOService.updateDescription('Take advantage of our clearance offers for fantastic deals on a wide range of products');

  }

  ngAfterViewInit(): void {
  }
  openDetailsItem(item: any): void {
    console.log('openDetailsItem: ', item);
  }

}
