import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { CartItems } from 'src/app/core/models/cart-items.model';
import { filter, switchMap } from 'rxjs/operators';
import { FindFirstRowService } from 'src/app/core/services/find-first-row.service';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { SessionStorageService } from './../../services/session-storage.service';
@Injectable({
  providedIn: 'root',
})
export class CartItemsService {
  baseUrl = environment.url;
  constructor(
    private http: HttpClient,
    private findFirstRowService: FindFirstRowService,
    private sharedMenuObservableService: SharedMenuObservableService,
    private sessionStorageService: SessionStorageService
  ) {}
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'

  getCartItems(where?: any): Observable<CartItems[]> {
    let url = `${this.baseUrl}/cart/get-items?where=${JSON.stringify(where)}`;
    return this.http
      .get<CartItems[]>(url)
      .pipe
      // tap(data => console.log('getCartItems:--- ', data)),
      ();
  }
  setCartItemsLength(userId?: string) {
    this.getCartItems({ user_id: userId })
      .pipe(
        switchMap((data: any[]) => {
          return this.findFirstRowService.findFirstRows(data);
        })
      )
      .subscribe((data: any[]) => {
        this.sharedMenuObservableService.cart_badge_count.next(
          data.length.toString()
        );
      });
  }
  makeUserCart(userId: string) {
    this.isUserCartExist(userId)
      .pipe(
        filter((data: any) => data === null),
        switchMap(() => {
          const url = `${this.baseUrl}/cart/create`;
          return this.http
            .post(url, { user_id: userId })
            .pipe(tap((data) => console.log('makeUserCart: ', data)));
        })
      )
      .subscribe();
  }
  addCartItem(cartItem: Partial<CartItems>): Observable<CartItems> {
    const userProfile: any = this.sessionStorageService.getItem('token');
    const userId = userProfile.user.uid;
    return this.isUserCartExist(userId).pipe(
      switchMap((data: any) => {
        const id: string = data.id;
        const params = {
          id: id,
          sale_list_id: cartItem.sale_list_id,
          quantity: cartItem.quantity,
        };

        const url = `${this.baseUrl}/cart/add-item`;
        return this.http
          .post<CartItems>(url, params)
          .pipe
          // tap(data => console.log('addCartItem: ', data)),
          ();
      })
    );
  }
  updateCart(cartItem: CartItems) {
    const url = `${this.baseUrl}/cart/update`;
    return this.http
      .post(url, cartItem)
      .pipe
      // tap(data => console.log('updateCartItem: ', data)),
      ();
  }
  isUserCartExist(userId: string) {
    const url = `${this.baseUrl}/cart/is-user-cart-exist/?user_id=${userId}`;
    return this.http
      .get(url)
      .pipe
      // tap((data) => console.log('isUserCartExist: ', data))
      ();
  }
  // Is there cart item in the cart
  isCartItemExist(userId: string, saleListId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getCartItems({ user_id: userId })
        .pipe(
          switchMap((data: any[]) => {
            return this.findFirstRowService.findFirstRows(data);
          }),
          tap()
          // (data) => console.log('isCartItemExist: ', data)
        )
        .subscribe((data: any[]) => {
          // check if the sale_list_id is in the data
          const ret = data.find(
            (item: any) => item.sale_list_id === saleListId
          );
          resolve(ret ? true : false);
        }),
        (error: any) => {
          reject(error);
        };
    });
  }
}
