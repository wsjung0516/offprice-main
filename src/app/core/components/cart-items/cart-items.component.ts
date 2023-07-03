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
  forkJoin,
  of,
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
import { SaleList, SoldSaleList } from '../../models/sale-list.model';
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
    private sanitizer: DomSanitizer
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
              // this.ref.close();

              this.processAfterCheckout();
            }
          });
        }
      });
  }
  soldSaleList: Partial<SoldSaleList>[] = [];
  private processAfterCheckout() {
    const rdata = this.separateSaleListBySoldNSale();
    // console.log('deducted data: ', rdata);
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
        console.log('saleItem: ', saleItem);
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
          buyer_id: this.profile.user.uid,
        };
        this.soldSaleList.push(data);
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
      // console.log('create sale list - data: ', data);

      this.clearCartItems();
      this.saveSoldRecord(this.soldSaleList);
      this.cartItemsService.setCartItemsLength(rdata[0][0].user_id);
      // this.ref.close();
      this.snackBar.open('Checkout completed', 'success', {
        duration: 2000,
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
  private saveSoldRecord(soldItems: Partial<SoldSaleList>[]) {
    from(soldItems)
      .pipe(
        untilDestroyed(this),
        mergeMap((item: Partial<SoldSaleList>) => {
          return this.saleListService.createSoldRecord(item);
        })
      )
      .subscribe((data: any) => {
        console.log('createSoldRecord: ', data);
      });
  }
  private clearCartItems() {
    // console.log('write deducted data: ', data)
    this.ref.close();
    // Currently, the quantity is fixed to 0.
    from(this.items)
      .pipe(
        untilDestroyed(this),
        mergeMap((item: CartItems) => {
          return this.cartItemsService.clearCartItems(item);
        })
      )
      .subscribe((data: any) => {});
  }
  private separateSaleListBySoldNSale(): any[] {
    return this.items.map((item) => {
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
    // console.log('checkIfSalesItemIsAvailable: ', message);
  }
  tmpSaleList: SaleList[] = [];
  checkIfSalesItemIsAvailable(): Observable<string[]> {
    this.tmpSaleList = [];
    return from(this.items).pipe(
      untilDestroyed(this),
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
