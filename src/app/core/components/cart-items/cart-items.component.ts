import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemsService } from './cart-items.service';
import { CartItems } from 'src/app/core/models/cart-items.model';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { FindFirstRowService } from 'src/app/core/services/find-first-row.service';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  Observable,
  toArray,
  from,
  mergeMap,
  tap,
  filter,
} from 'rxjs';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserSaleListService } from 'src/app/modules/dashboard/components/sale-list/user-sale-list.service';
import { DetailsItemComponent } from '../details-item/details-item.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { UserTokenService } from '../../services/user-token.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSaleList } from '../../models/user-sale-list.model';
import { DomSanitizer } from '@angular/platform-browser';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { SaleListService } from 'src/app/modules/dashboard/components/sale-list/sale-list.service';
@UntilDestroy()
@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    ConfirmDialogComponent,
    FormsModule,
    ReactiveFormsModule,
    WarningDialogComponent
  ],
  templateUrl: './cart-items.component.html',
  styles: [
    `
      .container {
        height: 100vh;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private saleListService: SaleListService,
    private userTokenService: UserTokenService,
    private sanitizer: DomSanitizer,
  ) {}
  checkResult: string[] = [];  
  ngOnInit(): void {
    this.sharedMenuObservableService.closeCartItemsDialog$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.ref.close();
      });
  }
  profile: any;

  ngAfterViewInit(): void {
    this.userTokenService.getUserToken().subscribe((profile: any) => {
      if (profile) {
        this.profile = profile;
        this.cartItemsService
          .getCartItems({ user_id: profile.user.uid })
          .pipe(
            switchMap((data: any[]) => {
              return this.findFirstRowService.findFirstRows(data);
            })
          )
          .subscribe((data: any[]) => {
            this.items = data;
            this.totalPrice = this.items.reduce((acc, item) => {
              return acc + item.price * item.quantity;
            }, 0);
            this.cd.detectChanges();
          });
      }
    });
  }
  onCheckout() {
    this.dialogService.open(ConfirmDialogComponent, {
      data: {
        title: 'Checkout',
        message: 'Are you sure you want to checkout?',
      }
    })
    .afterClosed$.subscribe(
      (result: any) => {
        if (result) {
          this.checkResult = [];
          this.checkIfSalesItemIsAvailable().subscribe((data: string[]) => {
            this.checkResult = data;
            console.log('checkResult: ', this.checkResult);
            if (this.checkResult.length > 0) {
              this.displayWarningMessage();
            } else {
              // this.ref.close();
      
              // this.processAfterCheckout();
            }
          });
        }
      }
    )

  }
  private processAfterCheckout() {
    const rdata = this.calculateDeductionQuantity();
    console.log('deducted data: ', rdata);
    from(rdata).pipe( // [{sale_list_id: 1, quantity: 1}, {sale_list_id: 2, quantity: 2}]
      untilDestroyed(this),
      mergeMap((data:any) =>{
        return this.saleListService.updateSaleList(data.sale_list_id, {quantity: data.quantity});
      }),
      toArray()
    ).subscribe((data: any) => {
      this.clearCartItems(data)
      this.ref.close();
      this.snackBar.open('Checkout completed', 'success', {
        duration: 2000,
      });
    });
  }
  private clearCartItems(data: any[]) {
    console.log('write deducted data: ', data)
    this.ref.close();
    // Currently, the quantity is fixed to 0.
    from(this.items).pipe(
      untilDestroyed(this),
      mergeMap((item: CartItems) => {
        return  this.cartItemsService.clearCartItems(item);

      })
    ).subscribe((data: any) => {
    });
  }
  private calculateDeductionQuantity() {
    return this.items.map((item) => {
      const correspondingItem = this.tmpUserSaleList.find(
        (el: any) =>
          el.sale_list_id === item.sale_list_id && el.user_id === item.user_id
      );
      if (correspondingItem) {
        const quantity = correspondingItem.quantity - item.quantity;
        return {
          sale_list_id: item.sale_list_id,
          quantity,
          // user_id: item.user_id,
        };
      }
      return null;
    });
  }
  private displayWarningMessage() {
    const message = this.sanitizer.bypassSecurityTrustHtml('Some items are not available' + '<br>' + `${this.checkResult.join('<br>')}`);
    this.dialogService.open(WarningDialogComponent, {
      data: {
        title: 'Warning',
        message: message,
      },
    }).afterClosed$.subscribe((result: any) => {

      if (result) {
        // this.ref.close();
      }
    });
    // console.log('checkIfSalesItemIsAvailable: ', message);
  }
  tmpUserSaleList: UserSaleList[] = [];
  checkIfSalesItemIsAvailable(): Observable<string[]> {
    this.tmpUserSaleList = [];
    return from(this.items).pipe(
      untilDestroyed(this),
      mergeMap((data: CartItems) =>
        this.getUserSalesItemQuantity(data.sale_list_id, data.user_id).pipe(
          tap((data: UserSaleList) => {
            this.tmpUserSaleList.push(data);
          }),
          map((userSaleList: UserSaleList | null) => ({
            ...data,
            userSaleList,
          })),
          toArray(),
        )
      ),
      map((data: (CartItems & { userSaleList: UserSaleList | null })[]) =>
        data
          .filter(
            (item) =>
              item.userSaleList !== null &&
              item.quantity > item.userSaleList.quantity
          )
          .map(
            (item, index) =>
            `Product Name: ${item.userSaleList.product_name}, Category: ${item.userSaleList.category}, Quantity:  ${item.userSaleList.quantity}`
        
            )
      ),
      map((data: string[]) => data[0]),
      filter((data: string) => data !== undefined),
      toArray()
    );
  }
  getUserSalesItemQuantity(
    sale_list_id: number,
    user_id: string
  ): Observable<UserSaleList> {
    const data = {
      sale_list_id: sale_list_id,
      user_id: user_id,
    };
    return this.userSaleListService
      .getUserSalesItemQuantity(data)
      .pipe
      // map((data: UserSaleList) => data.quantity)
      ();
  }
  sale_list_id: number;
  onChangeQuantity(item: CartItems) {
    if (item.quantity <= 0) {
      item.quantity = 1;
    }
    this.sale_list_id = item.sale_list_id;
    this.totalPrice = this.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    this.addCartItem(item.quantity, item.sale_list_id);
    // console.log('this.items: ', this.items);
  }
  private addCartItem(quantity: number, sale_list_id?: number) {
    const data: Partial<CartItems> = {
      sale_list_id: sale_list_id,
      // sale_list_id: this.sale_list_id,
      quantity: quantity,
    };
    this.cartItemsService.addCartItem(data).subscribe((data) => {
      this.userTokenService.getUserToken().subscribe((profile: any) => {
        if (profile) {
          this.cartItemsService.setCartItemsLength(profile.user.uid);
          this.cd.detectChanges();
        }
      });
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
    ret.afterClosed$.subscribe((result: any) => {
      if (result) {
        this.ref.close();
        // Currently, the quantity is fixed to 0.
        const data = {
          sale_list_id: item.sale_list_id,
          quantity: 0,
        };
        this.cartItemsService.addCartItem(data).subscribe((data) => {
          this.userTokenService.getUserToken().subscribe((profile: any) => {
            if (profile) {
              this.cartItemsService.setCartItemsLength(profile.user.uid);
              this.snackBar.open('Deleted from cart', 'success', {
                duration: 2000,
              });
              // To maintain the cart item dialog open.
              this.sharedMenuObservableService.refreshCartItemsButton.next(
                true
              );
            }
          });
        });

        // this.dialogRef.close({ status: 'delete', data: this.item});
      }
    });
  }
}
