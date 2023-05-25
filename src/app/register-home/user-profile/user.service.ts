import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/core/models/user.model';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.url;
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'
  getUsers(
    skip: number,
    take: number,
    orderBy?: any,
    where?: any
  ): Observable<User[]> {
    let url: string;
    const dat = { data: where };
    const whereData = JSON.stringify(dat);
    const order = JSON.stringify(orderBy);
    // console.log('whereData: ', whereData);
    // console.log('where: ', where);

    if (where && whereData) {
      url = `${this.baseUrl}/user?skip=${skip}&take=${take}&orderBy=${order}&where=${whereData}`;
    } else {
      url = `${this.baseUrl}/user?skip=${skip}&take=${take}&orderBy=${order}`;
    }
    return this.http.get(url).pipe(
      map((data: any) => data),
      shareReplay(1)
    );
  }
  getUser(id: string): Observable<User> {
    const url = `${this.baseUrl}/user/${id}`;

    return this.http.get(url).pipe(map((data: any) => data));
  }
  getConditionalUserLength(where: any): Observable<User[]> {
    const dat = { data: where };
    let url: string;
    if (where && where.length > 0) {
      const whereData = JSON.stringify(dat);
      url = `${this.baseUrl}/user/length?where=${whereData}`;
    } else {
      url = `${this.baseUrl}/user/length`;
    }

    return this.http.get(url).pipe(
      map((data: any) => data),
      shareReplay(1)
    );
  }
  createUser(data: Partial<User>): Observable<User> {
    const url = `${this.baseUrl}/user`;
    return this.http
      .post(url, { data }, { headers: this.headers })
      .pipe(map((data: any) => data));
  }
  updateUser(id: string, data: Partial<User>): Observable<User> {
    const url = `${this.baseUrl}/user/${id}`;
    return this.http
      .patch(url, { data }, { observe: 'response' })
      .pipe(map((data: any) => data));
  }
  deleteUser(id: string): Observable<User> {
    const url = `${this.baseUrl}/user/${id}`;

    return this.http.delete(url).pipe(map((data: any) => data));
  }
  saveUserProfileToDB(data: any) {
    // call from app.component.ts
    // Because login with firebase, we need to save user-profile profile to our DB, when new user login
    let user: any = {};
    user.first_name = data.user.displayName?.split('')[0];
    user.last_name = data.user.displayName?.split('')[1];
    user.user_id = data.user.uid;
    user.email = data.user.email;
    // Check if user-profile exist in our DB
    const ret = this.getUser(user.user_id).subscribe((ret: any) => {
      // onsole.log('saveUserProfileToDB -ret', ret);
      if (!ret) {
        this.createUser(user).subscribe((result) => {
          this.snackBar.open('User updated', 'OK', { duration: 3000 });
        });
      }
    });
  }
}
