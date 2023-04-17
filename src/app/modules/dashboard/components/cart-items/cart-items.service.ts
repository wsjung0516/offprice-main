import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { CartItems } from 'src/app/core/models/cart-items.model';
@Injectable({
  providedIn: 'root'
})
export class CartItemsService {
  baseUrl = environment.url;
  constructor(private http: HttpClient) {}
  headers = { 'content-type': 'application/json'}; // 'Accept': 'application/json'

  getCartItems(where?: any): Observable<CartItems[]>{
    let url = `${this.baseUrl}/cart/get-items?where=${JSON.stringify(where)}`;
    return this.http.get<CartItems[]>(url).pipe(
      tap(data => console.log('getCartItems:--- ', data)),
    )
  }
}
