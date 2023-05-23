import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, filter, map, of, share, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from './session-storage.service';

export interface UserToken {
  id: string;
  token: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserTokenService {
  baseUrl = environment.url;
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private sessionStorageService: SessionStorageService
  ) {}
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'
  getUserToken(): Observable<any> {
    const userId: any = this.sessionStorageService.getItem('userId');
    if(!userId) {
      return of(null);
    } 
    const id = userId.id;
    const url = `${this.baseUrl}/user-token/${id}`;
    return this.http.get<any>(url).pipe(
      tap((data) => {
        // console.log('user token: ', data);
      }),
      map((data: any) => {
        return JSON.parse(data.token);
      }),
      shareReplay(1)
    );
  }
  createUserToken(value: any): Observable<any> {
    const url = `${this.baseUrl}/user-token`;
    console.log('create UserToken: ', url);
    const token = JSON.stringify(value);
    const data = { user_id: value.user.uid, token: token };
    return this.http.post(url, { data }).pipe(
      map((data) => data),
      // tap((data) => console.log('user token created: ', data))
    );
  }
  updateUserToken(value: any): Observable<any> {
    const userId: any = this.sessionStorageService.getItem('userId');
    if(!userId) return of(null);
    const id = userId.id;
    const data = {
      user_id: userId.user_id,
      token: JSON.stringify(value),
    };
    const url = `${this.baseUrl}/user-token/${id}`;
    // console.log('updateUserToken: ', url);
    return this.http.patch(url, { data }).pipe(
      map((data) => data),
      // tap((data) => console.log('user token updated: ', data))
    );
  }
  deleteUserToken() {
    const userId: any = this.sessionStorageService.getItem('userId');
    if(!userId) return;
    const id = userId.id;
    const url = `${this.baseUrl}/user-token/${id}`;
    this.http
      .delete(url)
      .pipe()
      .subscribe((data) => {
        this.snackBar.open('Logged out successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
      });
  }
}
