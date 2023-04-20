import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { HtmlContentComponent } from 'src/app/core/utils/html-content/html-content.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './../confirm-dialog/confirm-dialog.component';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CartItemsService } from 'src/app/core/components/cart-items/cart-items.service';
import { SessionStorageService } from './../../services/session-storage.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { AuthService } from 'src/app/auth/keycloak/auth.service';
export interface Data {
  data: Partial<UserSaleList>;
}
@Component({
  selector: 'app-details-item',
  standalone: true,
  imports: [
CommonModule,
    HtmlContentComponent,
    ConfirmDialogComponent,
    MatIconModule,
    MatSnackBarModule,

  ],
  templateUrl: './details-item.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsItemComponent implements OnInit, AfterViewInit {
  item: any;
  ref: DialogRef<Data> = inject(DialogRef);
  isCartItemExist = false;
  userId: string;
  constructor(
    // public dialogRef: MatDialogRef<DetailsItemComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private cartItemsService: CartItemsService,
    private sessionStorageService: SessionStorageService,
    private snackBar: MatSnackBar,
    private sharedMenuObservableService: SharedMenuObservableService,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    const profile: any = this.sessionStorageService.getItem('userProfile');
    this.userId = profile?.id;
  }
  ngAfterViewInit(): void {
    this.item = { ...this.ref.data.data };
    // this.item = {...this.data};
    this.cd.detectChanges();
    this.cartItemsService.isCartItemExist(this.userId, this.item.sale_list_id)
    .then((data) => {
      // console.log('isCartItemExist: ret ', data);
      this.isCartItemExist = data;
      this.cd.detectChanges();
    });
  }
  onSave(): void {
    const userProfile = this.sessionStorageService.getItem('userProfile');
    if (!userProfile) {
      this.authService.login();
    }

    // Currently, the quantity is fixed to 1.
    const quantity = 1;
    const { user_id, sale_list_id } = this.item;
    this.cartItemsService
      .addCartItem({ user_id, sale_list_id, quantity })
      .subscribe((data:any) => {
        //console.log('addCartItems', data);
        this.cartItemsService.setCartItemsLength(this.userId);
        this.snackBar.open('Added to cart', 'Success', {  duration: 2000, })

      });

    this.ref.close({ status: 'save', data: this.item });
    // this.dialogRef.close({ status: 'save', data: this.item});
  }
  onDelete(): void {
    const ret = this.dialogService.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this item?',
      },
    });
    ret.afterClosed$.subscribe((result) => {
      if (result) {
        this.ref.close({ status: 'delete', data: this.item });
        // Currently, the quantity is fixed to 1.
        const quantity = 0;
        const { user_id, sale_list_id } = this.item;
        this.cartItemsService
          .addCartItem({ user_id, sale_list_id, quantity })
          .subscribe((data) => {
            // console.log('deletedCartItems', data);
            this.cartItemsService.setCartItemsLength(this.userId);
            this.snackBar.open('Deleted from cart', 'Success', {  duration: 2000, })
            this.sharedMenuObservableService.refreshCartItemsButton.next(true);
            this.sharedMenuObservableService.closeCartItemsDialog.next(true);

          });

        // this.dialogRef.close({ status: 'delete', data: this.item});
      }
    });
  }
  onClose(): void {
    this.ref.close();
    // this.dialogRef.close();
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
