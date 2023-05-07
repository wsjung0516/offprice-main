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
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
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
    private router: Router
  ) {}
  ngOnInit(): void {
    const profile: any = this.sessionStorageService.getItem('token');
    this.userId = profile?.user.uid;
  }
  ngAfterViewInit(): void {
    this.item = { ...this.ref.data.data };
    // this.item = {...this.data};
    this.cd.detectChanges();
    this.cartItemsService
      .isCartItemExist(this.userId, this.item.sale_list_id)
      .then((data) => {
        // console.log('isCartItemExist: ret ', data);
        this.isCartItemExist = data;
        this.cd.detectChanges();
      });
  }
  onSave(): void {
    const userProfile:any = this.sessionStorageService.getItem('token');
    if (!userProfile?.user) {
      this.router.navigate(['/login']);
      return;
    }

    // Currently, the quantity is fixed to 1.
    const quantity = 1;
    const { user_id, sale_list_id } = this.item;
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
