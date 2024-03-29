import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  effect,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemsService } from './cart-items.service';
import { CartItems } from 'src/app/core/models/cart-items.model';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import {
  map,
  Observable,
  toArray,
  from,
  mergeMap,
  tap,
  filter,
  forkJoin,
  of,
  finalize,
} from 'rxjs';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { ConfirmDialogComponent } from 'src/app/core/components/confirm-dialog/confirm-dialog.component';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserSaleListService } from 'src/app/modules/dashboard/components/sale-list/user-sale-list.service';
import { DetailsItemComponent } from '../details-item/details-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { SaleListService } from 'src/app/modules/dashboard/components/sale-list/sale-list.service';
import { SaleList, SoldSaleList } from '../../models/sale-list.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/login/services/auth.service';

// @UntilDestroy()
@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    ConfirmDialogComponent,
    FormsModule,
    ReactiveFormsModule,
    WarningDialogComponent,
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
  ref: DialogRef<any> = inject(DialogRef);
  soldSaleList: Partial<SoldSaleList>[] = [];
  authService = inject(AuthService);
  checkResult: string[] = [];
  profile: any;
  items = this.cartItemsService.cartItems; // signal<CartItems[]>([]);
  totalPrice = this.cartItemsService.totalPrice; // signal(0);
  user = this.authService.user; // user = signal<UserId | undefined>(undefined);

  constructor(
    private cartItemsService: CartItemsService,
    private sharedMenuObservableService: SharedMenuObservableService,
    private sessionStorageService: SessionStorageService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private userSaleListService: UserSaleListService,
    private saleListService: SaleListService,
    private sanitizer: DomSanitizer,
  ) {
    effect(() => {
      if (sharedMenuObservableService.closeCartItemsDialog()) {
        this.ref.close();
        sharedMenuObservableService.closeCartItemsDialog.set(false);
      }
      console.log('items---', this.items())
    }, {allowSignalWrites: true});
  }
  
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }
  onCheckout() {
    this.dialogService
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Checkout',
          message: 'Are you sure you want to checkout?',
        },
      })
      .afterClosed$.subscribe((result: any) => {
        if (result) {
          this.checkResult = [];
          this.checkIfSalesItemIsAvailable().subscribe((data: string[]) => {
            this.checkResult = data;
            // console.log('checkResult: ', this.checkResult);
            if (this.checkResult.length > 0) {
              this.displayWarningMessage();
            } else {
              this.processAfterCheckout();
            }
          });
        }
      });
  }

  private processAfterCheckout() {
    const rdata = this.separateSaleListBySoldNSale();
    /*  [
      [{sale_list_id: 54, quantity: 24, status1: 'Sale'},
       {sale_list_id: 54, quantity: 3, status1: 'Sold'}
      ],
      [{sale_list_id: 55, quantity: 26, status1: 'Sale'},
       {sale_list_id: 55, quantity: 2, status1: 'Sold'}
      ],
      [{sale_list_id: 58, quantity: 28, status1: 'Sale'},
       {sale_list_id: 58, quantity: 1, status1: 'Sold'}
      ]
    ]
 */

    const observables: Observable<[SaleList, SaleList]>[] = [];
    this.soldSaleList = [];
    rdata.forEach((item) => {
      const saleItem = item.find((subItem: any) => subItem.status1 === 'Sale');
      const soldItem = item.find((subItem: any) => subItem.status1 === 'Sold');
      if (saleItem && soldItem) {
        // console.log('saleItem: ', saleItem);
        const data = {
          user_id: saleItem.user_id,
          sale_list_id: soldItem.sale_list_id,
          product_name: saleItem.product_name,
          image_sm_urls: saleItem.image_sm_urls,
          vendor: saleItem.vendor,
          category: saleItem.category,
          category1: saleItem.category1,
          quantity: soldItem.quantity,
          price: saleItem.price,
          buyer_id: this.user().user_id,
        };
        this.soldSaleList.push(data);
        // Write deducted data to sale list. each item by separating sale and sold.
        const saleObservable = this.checkIfNeedToCreateSaleList(saleItem);
        const soldObservable = this.saleListService.updateSaleList(
          soldItem.sale_list_id,
          { quantity: soldItem.quantity, status1: 'Sold' }
        );
        const combinedObservable = forkJoin([saleObservable, soldObservable]);
        observables.push(combinedObservable);
      }
    });

    forkJoin(observables).subscribe((data: [SaleList, SaleList][]) => {
      /* 
      [
        [{sale_list_id: 54, quantity: 24, status1: 'Sale'},HttpResponse],
        [{sale_list_id: 65, quantity: 27, status1: 'Sale'},HttpResponse]
      ],
      */

      const r1 = this.clearCartItems();
      const r2 = this.saveSoldRecord(this.soldSaleList);
      forkJoin([r1, r2]).subscribe((data) => {
        // 
        const userId:any = this.sessionStorageService.getItem('userId');
        // this.cartItemsService.displayCartItemsLength(userId.user_id);
        //
        this.snackBar.open('Checkout completed', 'success', {
          duration: 2000,
        });
      });
    });
  }
  // To skip creating sale list if the quantity is 0.
  private checkIfNeedToCreateSaleList(saleItem: SaleList): Observable<any> {
    if (saleItem.quantity > 0) {
      return this.saleListService.createSaleList(saleItem);
    } else {
      return of(null);
    }
  }
  private saveSoldRecord(soldItems: Partial<SoldSaleList>[]): Observable<any> {
    return from(soldItems).pipe(
      // untilDestroyed(this),
      takeUntilDestroyed(this.destroyRef),

      tap((item: Partial<SoldSaleList>) => {
        // console.log('sold item: ', item);
      }),
      mergeMap((item: Partial<SoldSaleList>) => {
        return this.saleListService.createSoldRecord(item);
      })
    );
  }
  private clearCartItems(): Observable<any> {

    return from(this.items()).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((item: CartItems) => {
        // console.log('clearCartItems: ', item);
      }),
      mergeMap((item: CartItems) => {
        return this.cartItemsService.clearCartItems(item);
      
      }),
      finalize(() => {
        this.ref.close();
        this.cartItemsService.cartItems.set([]);
      })
    );
  }
  private separateSaleListBySoldNSale(): any[] {
    return this.items().map((item) => {
      // console.log('item: ', item, this.tmpSaleList)
      const correspondingItem = this.tmpSaleList.find(
        (el: any) => el.sale_list_id === item.sale_list_id
      );
      if (correspondingItem) {
        const saleQuantity = correspondingItem.quantity - item.quantity;
        const soldQuantity = item.quantity;
        delete correspondingItem.created_at; // To create new sale list, created_at should be deleted.
        delete correspondingItem.sale_list_id; // To create new sale list, sale_list_id should be deleted.
        return [
          {
            ...correspondingItem,
            ...{ quantity: saleQuantity, status1: 'Sale' },
          },
          {
            sale_list_id: item.sale_list_id,
            quantity: soldQuantity,
            status1: 'Sold',
          },
        ];
      }
      return [];
    });
  }
  private displayWarningMessage() {
    const message = this.sanitizer.bypassSecurityTrustHtml(
      'Some items are not available' +
        '<br>' +
        `${this.checkResult.join('<br>')}`
    );
    this.dialogService
      .open(WarningDialogComponent, {
        data: {
          title: 'Warning',
          message: message,
        },
      })
      .afterClosed$.subscribe((result: any) => {
        if (result) {
          // this.ref.close();
        }
      });
  }
  tmpSaleList: SaleList[] = [];
  destroyRef = inject(DestroyRef);
  checkIfSalesItemIsAvailable(): Observable<string[]> {
    this.tmpSaleList = [];
    return from(this.items()).pipe(
      takeUntilDestroyed(this.destroyRef),
      // takeUntilDestroyed(this.destroyRef),
      // untilDestroyed(this),
      mergeMap((data: CartItems) =>
        this.getSalesItemQuantity(data.sale_list_id).pipe(
          tap((data: SaleList) => {
            this.tmpSaleList.push(data);
          }),
          map((saleList: SaleList | null) => ({
            ...data,
            saleList,
          })),
          toArray()
        )
      ),
      map((data: (CartItems & { saleList: SaleList | null })[]) =>
        data
          .filter((item) => {
            // console.log('item: ----------', item, item.quantity, item.saleList.quantity)
            return (
              item.saleList !== null && item.quantity > item.saleList.quantity
            );
          })
          .map(
            (item, index) =>
              `Product Name: ${item.saleList.product_name}, Category: ${item.saleList.category}, Quantity:  ${item.saleList.quantity}`
          )
      ),
      // tap((data: string[]) => console.log('checkIfSalesItemIsAvailable: ', data)),
      map((data: string[]) => data[0]),
      filter((data: string) => data !== undefined),
      toArray()
    );
  }
  getSalesItemQuantity(
    sale_list_id: number
    // user_id: string
  ): Observable<SaleList> {
    const data = {
      sale_list_id: sale_list_id,
      // user_id: user_id,
    };
    return this.saleListService
      .getSalesItemQuantity(data)
      .pipe
      // tap((data: SaleList) => console.log('getUserSalesItemQuantity: ', data))
      ();
  }
  sale_list_id: number;
  onChangeQuantity(item: CartItems) {
    if (item.quantity <= 0) {
      item.quantity = 1;
    }
    this.cartItemsService.addCartItem(item).subscribe();
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
        item.quantity = 0;
        this.cartItemsService.addCartItem(item).subscribe((data) => {
          // this.cartItemsService.displayCartItemsLength(profile.user.uid);
          this.snackBar.open('Deleted from cart', 'success', {
            duration: 2000,
          });
          // To maintain the cart item dialog open.
          this.sharedMenuObservableService.refreshCartItemsButton.set(true);
        });
      }
    });
  }
}
