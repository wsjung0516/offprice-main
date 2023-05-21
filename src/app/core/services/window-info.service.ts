import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, filter, map, of, share, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class WindowInfoService {
  baseUrl = environment.url;
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private sessionStorageService: SessionStorageService
  ) {}
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'
  getWindowInfo(): Observable<any> {
    const userId: any = this.sessionStorageService.getItem('userId');
    if(!userId) {
      return of(null);
    } 
    const id = userId.id;
    const url = `${this.baseUrl}/window-info/${id}`;
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
  createWindowInfo(value: any): Observable<any> {
    const url = `${this.baseUrl}/user-token`;
    console.log('create WindowInfo: ', url);
    const token = JSON.stringify(value);
    const data = { user_id: value.user.uid, token: token };
    return this.http.post(url, { data }).pipe(
      map((data) => data),
      // tap((data) => console.log('user token created: ', data))
    );
  }
  updateWindowInfo(value: any): Observable<any> {
    const userId: any = this.sessionStorageService.getItem('userId');
    if(!userId) return of(null);
    const id = userId.id;
    const data = {
      user_id: userId.user_id,
      token: JSON.stringify(value),
    };
    const url = `${this.baseUrl}/window-info/${id}`;
    // console.log('updateWindowInfo: ', url);
    return this.http.patch(url, { data }).pipe(
      map((data) => data),
      // tap((data) => console.log('user token updated: ', data))
    );
  }
  deleteWindowInfo() {
    const userId: any = this.sessionStorageService.getItem('userId');
    if(!userId) return;
    const id = userId.id;
    const url = `${this.baseUrl}/window-info/${id}`;
    this.http
      .delete(url)
      .pipe()
      .subscribe((data) => {
        this.snackBar.open('Window info token deleted', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
      });
  }
}
