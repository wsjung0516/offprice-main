import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, filter, map, of, share, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';

export interface MySize {
  id: string;
  category: string;
}
@Injectable({
  providedIn: 'root',
})
export class DesignSizeMenuService {
  baseUrl = environment.url;
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private sessionStorageService: SessionStorageService
  ) {}
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'
  getMySize(): Observable<any> {
    const userId: any = this.sessionStorageService.getItem('userId');
    if(!userId) {
      return of(null);
    } 
    const id = userId.user_id;
    const url = `${this.baseUrl}/my-size/${id}`;
    return this.http.get<any>(url).pipe(
      tap((data) => {
        // console.log('user category: ', data);
      }),
      filter((data) => data.length > 0),
      map((data: any) => {
        return JSON.parse(data[0].size_menus);
      }),
      shareReplay(1)
    );
  }
  createMySize(value: any): Observable<any> {
    const userId: any = this.sessionStorageService.getItem('userId');
    if(!userId) return of(null);
    const url = `${this.baseUrl}/my-size`;
    // console.log('create MySize: ', url);
    // const categories = JSON.stringify(value);

    const data = { user_id: userId.user_id, size_menus: value };
    return this.http.post(url, data).pipe(
      map((data) => data),
      // tap((data) => console.log('user category created: ', data))
    );
  }
}