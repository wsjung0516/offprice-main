import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, map, tap } from "rxjs";
import { environment } from "src/environments/environment";

export interface UserToken {
  id: string;
  token: string;
}
@Injectable({
    providedIn: 'root'
})
export class UserTokenService {
  baseUrl = environment.url;
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'
  getUserToken(): Observable<UserToken> {
    const url = `${this.baseUrl}/user-token`;
    return this.http.get<any>(url).pipe(
      tap((data) => {
        // console.log('user token: ', data);
      }),
      map((data: any) => {
        if (Object.keys(data.token).length > 0) {
          try {
            return JSON.parse(data.token);
          } catch (error) {
            console.error('Error parsing JSON: ', error);
            return null;
          }
        } else {
          return null;
        }
      })
    )
  }
  updateUserToken(value: any): Observable<any>{
    const id = '1';
    const data = JSON.stringify(value);
    const url = `${this.baseUrl}/user-token/${id}`;
    console.log('updateUserToken: ', url);
    return this.http.patch(url, {data}).pipe(
      map((data) => data),
      tap((data) => console.log('user token updated: ', data) )
    )
  }
  removeUserToken(){
    const data: string = null;
    const url = `${this.baseUrl}/user-token/1`;
    this.http.patch<any>(url, {data}).pipe()
    .subscribe((data) => console.log('user token removed: ', data) );
  }
}