import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  inject,
  signal,
  WritableSignal,
  computed,
  Signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { HtmlContentComponent } from 'src/app/core/utils/html-content/html-content.component';
import { ConfirmDialogComponent } from './../confirm-dialog/confirm-dialog.component';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { MatIconModule } from '@angular/material/icon';
// import { CartItemsService } from 'src/app/core/components/cart-items/cart-items.service';
// import { SessionStorageService } from './../../services/session-storage.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
// import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CartItemsService } from '../cart-items/cart-items.service';
import { SharedMenuObservableService } from '../../services/shared-menu-observable.service';
import { AuthService } from '../../auth/login/services/auth.service';
import { SaleList } from '../../models/sale-list.model';
import { CartItems } from '../../models/cart-items.model';
// import { UserTokenService } from '../../services/user-token.service';
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
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsItemComponent implements OnInit, AfterViewInit {
  //item: any;
  ref: DialogRef<Data> = inject(DialogRef);
  item: any = { ...this.ref.data.data };

  items = computed(() => this.ref.data.data);
  isCartItem = computed(() => this.cartItemsService.cartItems().findIndex((item) => item.sale_list_id === this.item.sale_list_id) === -1);

  selectedImage = '';
  constructor(
    private dialogService: DialogService,
    private cartItemsService: CartItemsService,
    private snackBar: MatSnackBar,
    private sharedMenuObservableService: SharedMenuObservableService,
    private router: Router,
    public authService: AuthService,
  ) {
    effect(() => {
       // console.log('DetailsItemComponent effect: ', this.isCartItem());
    })
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {
  }

  onSave(): void {
    if (!this.authService.user()) {
      this.ref.close();
      this.router.navigate(['/login']);
      return;
    }
    this.item.quantity = 1;
    this.cartItemsService
      .addCartItem(this.item)
      .subscribe((data: any) => {
        this.snackBar.open('Added to cart', 'Success', { duration: 2000 });
      });

    this.ref.close({ status: 'save', data: this.item });
    // this.dialogRef.close({ status: 'save', data: this.item});
  }
  onDelete(): void {
    console.log('onDelete')
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
        this.item.quantity = 0;
        console.log('user_id, sale_list_id - this.item',  this.item)
        this.cartItemsService
          .addCartItem(this.item)
          .subscribe((data) => {
            this.snackBar.open('Deleted from cart', 'Success', {
              duration: 2000,
            });
            // To maintain the cart item dialog.
            this.sharedMenuObservableService.refreshCartItemsButton.set(true);
            this.sharedMenuObservableService.closeCartItemsDialog.set(true);
          });
      }
    });
  }
  onClose(): void {
    this.ref.close();
    // this.dialogRef.close();
  }
}
function compted(arg0: () => boolean): WritableSignal<boolean> {
  throw new Error('Function not implemented.');
}

