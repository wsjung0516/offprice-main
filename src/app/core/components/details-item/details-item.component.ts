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
// import { CartItemsService } from 'src/app/core/components/cart-items/cart-items.service';
import { SessionStorageService } from './../../services/session-storage.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
// import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CartItemsService } from '../cart-items/cart-items.service';
import { SharedMenuObservableService } from '../../services/shared-menu-observable.service';
import { UserTokenService } from '../../services/user-token.service';
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
    MatCardModule,
  ],
  templateUrl: './details-item.component.html',
  styles: [
    `
      mat-card-content {
        padding: 0 !important;
      }

    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsItemComponent implements OnInit, AfterViewInit {
  item: any;
  ref: DialogRef<Data> = inject(DialogRef);
  isCartItemExist = false;
  selectedImage = '';
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
    private router: Router,
    private userTokenService: UserTokenService
  ) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    // const profile: any = this.sessionStorageService.getItem('token');
    // this.userId = profile?.user.uid;
    this.item = { ...this.ref.data.data };

    this.userTokenService.getUserToken().subscribe((loggedUser: any) => {
      if (!loggedUser) {
        this.clearItemData();
        // this.item = {...this.data};
        this.cd.detectChanges();
      } else {
        this.userId = loggedUser?.user?.uid;

        this.cartItemsService
          .isCartItemExist(this.userId, this.item.sale_list_id)
          .then((data) => {
            // console.log('isCartItemExist: ret ', data);
            this.isCartItemExist = data;
            this.cd.detectChanges();
          });
      }
    });
    //
    // To prevent from viewing the vendor's information when the user is not logged in.
  }
  private clearItemData() {
    this.item.store_name = '';
    this.item.register_no = '';
    this.item.email = '';
    this.item.representative_phone_no = '';
    this.item.representative_name = '';
    this.item.store_address1 = '';
    this.item.store_address2 = '';
    this.item.store_city = '';
    this.item.store_state = '';
    this.item.store_country = '';
  }

  onSave(): void {
    // const userProfile:any = this.sessionStorageService.getItem('token');
    // if (!userProfile?.user) {
    //   this.ref.close();
    //   this.router.navigate(['/login']);
    //   return;
    // }
    if (!this.userId) {
      this.ref.close();
      this.router.navigate(['/login']);
      return;
    }
    const { user_id, sale_list_id } = this.item;
    // Check if user logged in already from the register window.
    // const isRegisterLoggedIn = this.sessionStorageService.getItem('isRegisterLoggedIn');
    // if (isRegisterLoggedIn) {
    //   this.sharedMenuObservableService.isLoggedIn.next(user_id);
    // }
    // Currently, the quantity is fixed to 1.
    const quantity = 1;
    this.cartItemsService
      .addCartItem({ user_id, sale_list_id, quantity })
      .subscribe((data: any) => {
        //console.log('addCartItems', data);
        this.cartItemsService.setCartItemsLength(this.userId);
        this.snackBar.open('Added to cart', 'Success', { duration: 2000 });
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
            this.snackBar.open('Deleted from cart', 'Success', {
              duration: 2000,
            });
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
