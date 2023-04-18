import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { CartItems } from 'src/app/core/models/cart-items.model';
import { switchMap } from 'rxjs/operators';
import { FindFirstRowService } from 'src/app/core/services/find-first-row.service';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
@Injectable({
  providedIn: 'root'
})
export class CartItemsService {
  baseUrl = environment.url;
  constructor(
    private http: HttpClient,
    private findFirstRowService: FindFirstRowService,
    private sharedMenuObservableService: SharedMenuObservableService
    ) {}
  headers = { 'content-type': 'application/json'}; // 'Accept': 'application/json'

  getCartItems(where?: any): Observable<CartItems[]>{
    let url = `${this.baseUrl}/cart/get-items?where=${JSON.stringify(where)}`;
    return this.http.get<CartItems[]>(url).pipe(
      // tap(data => console.log('getCartItems:--- ', data)),
    )
  }
  setCartItemsLength(userId?: string){
    this.getCartItems({user_id: userId}).pipe(
      switchMap((data: any[]) => {
        return this.findFirstRowService.findFirstRows(data);
      })
    )
    .subscribe((data: any[]) => {
      console.log('setCartItemsLength: ', data.length, this.sharedMenuObservableService.cart_badge_count);
      this.sharedMenuObservableService.cart_badge_count.next(data.length.toString());
    });
  }
}
