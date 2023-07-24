import { computed, Injectable, OnInit, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartItems } from 'src/app/core/models/cart-items.model';
import { filter, switchMap } from 'rxjs/operators';
import { FindFirstRowService } from 'src/app/core/services/find-first-row.service';
import { SEOService } from './../../services/SEO.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/login/services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class CartItemsService implements OnInit {
  baseUrl = environment.url;
  constructor(
    private http: HttpClient,
    private findFirstRowService: FindFirstRowService,
    private sEOService: SEOService,
    private authService: AuthService
  ) {
    effect(() => {
      // console.log('CartItemsService effect: ', this.cartItems(), this.authService.user());
    })
  }
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'
  ngOnInit(): void {
    this.sEOService.updateTitle('Cart Items');
    this.sEOService.updateDescription('Closeout wholesale clothes cart imtes');
  }
  // 
  url = `${this.baseUrl}/cart/get-items?where=`;
  cartItems$ = toObservable(this.authService.user).pipe(
    switchMap((user) => {
      //console.log('cartItems$ user: ', user)
      if( user ) {
        const data = {user_id: user.user_id}
        return this.http.get<CartItems[]>(this.url + JSON.stringify(data));
      } else {
        return of([])
      }
    }),
    switchMap((data: any) => this.findFirstRowService.findFirstRows(data)),
    tap((data) => this.cartItems.set(data)),
  ).subscribe();
   // 
  cartItems = signal<CartItems[]>([]);
  subPrice = computed(() => this.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0));
  tax = computed(() => this.subPrice() * 0);
  transferFee = computed(() => this.subPrice() * 0);
  totalPrice = computed(() => this.subPrice() + this.tax() + this.transferFee());
   //
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
    return this.isUserCartExist(this.authService.user().user_id).pipe(
      switchMap((data: any) => {
        // console.log('addCartItem: ', data);
        const id: string = data.id;
        const params = {
          id: id,
          sale_list_id: cartItem.sale_list_id,
          quantity: cartItem.quantity,
        };

        const url = `${this.baseUrl}/cart/add-item`;
        return this.http
          .post<CartItems>(url, params)
          .pipe();
      }),
      tap((ret) =>  {
        this.updateCartItemsCount(cartItem);
      }),
    );
  }
  private updateCartItemsCount(cartItem: Partial<CartItems>) {
    if (cartItem.quantity > 0) {
      const index = this.cartItems().findIndex((item) => item.sale_list_id === cartItem.sale_list_id);
      if (index !== -1) {
        this.cartItems.mutate((items) => {
          items[index].quantity = cartItem.quantity;
        });
      }
      else {
        this.cartItems.mutate((items) => {
          items.push(cartItem as CartItems);
        });
      }
    } else {
      this.cartItems.update((items) => items.filter((item) => item.sale_list_id !== cartItem.sale_list_id));
    }
  }

  clearCartItems(cartItem: Partial<CartItems>): Observable<CartItems> {
    return this.isUserCartExist(cartItem.user_id).pipe(
      switchMap((data: any) => {
        const id: string = data.id;
        const params = {
          id: id,
          sale_list_id: cartItem.sale_list_id,
          quantity: 0,
        };

        const url = `${this.baseUrl}/cart/add-item`;
        return this.http
          .post<CartItems>(url, params)
          .pipe(
            tap(data => console.log('addCartItem: ', data)),
          );
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
    // console.log('isUserCartExist: ', userId);
    const url = `${this.baseUrl}/cart/is-user-cart-exist/?user_id=${userId}`;
    return this.http
      .get(url)
      .pipe
      // 
      (
        // tap((data) => console.log('isUserCartExist: ', data))
      );
  }
}
