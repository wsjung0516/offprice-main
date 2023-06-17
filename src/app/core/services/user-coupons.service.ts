import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, of, shareReplay, tap } from 'rxjs';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { environment } from 'src/environments/environment';
export interface UserCoupon {
  coupon_id: number;
  user_id: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserCouponsService {
  baseUrl = environment.url;
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private sessionStorageService: SessionStorageService
  ) {}
  getUserCoupons(): Observable<any> {
    const userId: any = this.sessionStorageService.getItem('userId');
    if(!userId) {
      return of(null);
    } 
    const coupon_id = 1;
    const user_id = userId.user_id;
    const url = `${this.baseUrl}/user-coupons/${user_id}/${coupon_id}`;
    return this.http.get<any>(url).pipe(
      tap((data) => {
        // console.log('user coupons: ', data);
      }),
      map((data: any) => data),
      shareReplay(1)
    );
  }
  createUserCoupon(quantity = 200): Observable<any> {
    const url = `${this.baseUrl}/user-coupons`;
    const userId: any = this.sessionStorageService.getItem('userId');
    if(!userId) {
      return of(null);
    }
    const coupon_id = 1;
    const user_id = userId.user_id;
    console.log('create UserCoupon: ', url);
    const data = { 
      quantity: quantity,
      coupon_id: coupon_id,
      user_id: user_id
     };
    return this.http.post(url, { data }).pipe(
      map((data) => data),
      // tap((data) => console.log('user token created: ', data))
    );
  }
}
