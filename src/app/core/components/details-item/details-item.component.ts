import { ChangeDetectionStrategy, Component, Inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { HtmlContentComponent } from 'src/app/core/utils/html-content/html-content.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './../confirm-dialog/confirm-dialog.component';
import { DialogService } from '@ngneat/dialog';
import { MatIconModule } from '@angular/material/icon';
export interface DialogData {
  data: Partial<UserSaleList>;
}
@Component({
  selector: 'app-details-item',
  standalone: true,
  imports: [CommonModule,
  HtmlContentComponent,
    ConfirmDialogComponent,
    MatIconModule
],
  templateUrl: './details-item.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsItemComponent implements OnInit, AfterViewInit {
  item: any;
  constructor(
    public dialogRef: MatDialogRef<DetailsItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService
  ) { }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {

    this.item = {...this.data};
    this.cd.detectChanges();

  }
  onSave(): void {
    
    this.dialogRef.close({ status: 'save', data: this.item});
  }
  onDelete(): void {
    const ret = this.dialogService.open(ConfirmDialogComponent,{
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this item?'
      }
    });
    ret.afterClosed$.subscribe((result) => {

      if( result ){
        this.dialogRef.close({ status: 'delete', data: this.item});
      }
    });
  }
  onClose(): void {
    this.dialogRef.close();
  } 
}
// export const item: Partial<UserSaleList> = {
//   product_name: "Product Name",
//   category: "Tops",
//   count: 100,
//   email: "jinsu.kim@gmail.com",
//   // created_at:"2023-04-13T19:32:54.000Z",
//   description: "<h1>Title</h1><p>1.test1</p><p>2.test2</p><p>3.test3</p><p>adkfjdasfkdasfdsafdasfdsafdasfdasfdasfasdfdsafasfasdfda</p><p>adkfjdasfkdasfdsafdasfdsafdasfdasfdasfasdfdsafasfasdfda</p><p>adkfjdasfkdasfdsafdasfdsafdasfdasfdasfasdfdsafasfasdfda</p>",

//   image_url: "https://offprice_bucket.storage.googleapis.com/263e8818-c66e-11ec-9c47-027098eb172b_E_1681414372510.jpg",
//   material: "Polyester",
//   price: '100',
//   register_no:"1234567890",
//   representative_name:"Junsu",
//   representative_phone_no: "111-2222-3333",
//   sale_list_id: '1032',
//   size: "XS",
//   status1: null,
//   status2: null,
//   status3: null,
//   store_address1: "3416 manning ave Apt3813",
//   store_address2: null,
//   store_city: "Los Angeles",
//   store_country: "US",
//   store_name: "ABC mart",
//   store_state: "CA",
//   user_id: "25b85792-ac77-4433-97bb-a622e03f3241",
//   vendor: "BBB",
//   }
