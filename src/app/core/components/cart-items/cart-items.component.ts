import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemsService } from './cart-items.service';
import { CartItems } from 'src/app/core/models/cart-items.model';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { FindFirstRowService } from 'src/app/core/services/find-first-row.service';
import { switchMap } from 'rxjs';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserSaleListService } from 'src/app/modules/dashboard/components/sale-list/user-sale-list.service';
import { DetailsItemComponent } from '../details-item/details-item.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { UserTokenService } from '../../services/user-token.service';
@UntilDestroy()
@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [CommonModule,
MatSnackBarModule,
    ConfirmDialogComponent
  ],
templateUrl: './cart-items.component.html' ,
  styles: [`
    .container {
      height: 100vh;
    }
  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemsComponent implements OnInit, AfterViewInit {
  items: CartItems[] = [];
  ref: DialogRef<any> = inject(DialogRef);
  totalPrice = 0;
  constructor(
    private cartItemsService: CartItemsService,
    private cd: ChangeDetectorRef,
    private sharedMenuObservableService: SharedMenuObservableService,
    private findFirstRowService: FindFirstRowService,
    private sessionStorageService: SessionStorageService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private userSaleListService: UserSaleListService,
    private userTokenService: UserTokenService,
    ) { }

  ngOnInit(): void {
    this.sharedMenuObservableService.closeCartItemsDialog$
    .pipe(untilDestroyed(this))
    .subscribe(() => {
      this.ref.close();
    })
  }
  profile:any;
  ngAfterViewInit(): void {

    this.userTokenService.getUserToken().subscribe((profile: any) => {
      if (profile) {
        this.profile = profile;
        this.cartItemsService.getCartItems({user_id: this.profile.user.uid}).pipe(
          switchMap((data: any[]) => {
            return this.findFirstRowService.findFirstRows(data);
          })
        ).subscribe((items: CartItems[]) => {
          this.items = items;
          console.log('this.items: ', this.items);
          this.totalPrice = items.reduce((acc, item) => {
            return acc + item.price;
          }, 0);
          this.cd.detectChanges();
        })
      }
    });
  }
  onSelectDetail(item: CartItems) {
    const sale_list_id = item.sale_list_id.toString();
    this.userSaleListService.getUserSaleList(sale_list_id).subscribe((data) => {

      const mobileMode = window.matchMedia('(max-width: 576px)').matches;
      const width = mobileMode ? '100%' : '58%';
      const dialogRef = this.dialogService.open(DetailsItemComponent, {
         data: {
          data: data,
         },
         width,
         // height: 'auto',
      });
  
      dialogRef.afterClosed$.subscribe((result) => {
        if (result === 'save') {
          // check if the item is already saved.
        } else if (result === 'delete') {
        }
        // console.log('The dialog was closed', result);
      });
    });
    //
  }

  onDeletedItem(item: CartItems) {
    // const profile:any = this.sessionStorageService.getItem('token');
    const ret = this.dialogService.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this item?',
      },
    });
    ret.afterClosed$.subscribe((result:any) => {
      if (result) {
        this.ref.close();
        // Currently, the quantity is fixed to 0.
        const data = {
          sale_list_id: item.sale_list_id,
          quantity: 0
        }
        this.cartItemsService
          .addCartItem(data)
          .subscribe((data) => {
            this.userTokenService.getUserToken().subscribe((profile: any) => {
              if (profile) {
                
                this.cartItemsService.setCartItemsLength(profile.user.uid);
                this.snackBar.open('Deleted from cart', 'success', {
                  duration: 2000,
                });
                // To maintain the cart item dialog open.
                this.sharedMenuObservableService.refreshCartItemsButton.next(true);
              }
            });
          });

        // this.dialogRef.close({ status: 'delete', data: this.item});
      }
    });
  }
}
