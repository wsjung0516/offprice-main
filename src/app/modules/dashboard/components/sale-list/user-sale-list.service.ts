import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserSaleListService {
  baseUrl = environment.url;
  constructor(private http: HttpClient, 
    private localStorageService: LocalStorageService
    ) {}
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'
  where: string;
  conditionalUserSaleListLength = signal<number>(0);

  getUserSaleLists(
    skip: number,
    take: number,
    orderBy?: any,
    where?: any,
    whereOR?: any
  ): Observable<UserSaleList[]> {
    // console.log('getUserSaleList', skip, take, orderBy, where, whereOR)
    const whereData = this.buildWhereData(where, whereOR);
    
    const order = JSON.stringify(orderBy);
    let url = `${this.baseUrl}/user-sale-list?skip=${skip}&take=${take}&orderBy=${order}`;
    if (whereData) {
      url += `&where=${JSON.stringify(whereData)}`;
      this.where = `?where=${JSON.stringify(whereData)}`;
    } else {
      const tmp = {AND: [{category1: '1'}]};
      this.where = `?where=${JSON.stringify(tmp)}`;
    }
    // console.log('saleLists', url)
    return this.http
      .get<UserSaleList[]>(url)
      .pipe (
        // tap(data => console.log('data: ', data))
      );
  }

  private buildWhereData(
    where: any[],
    whereOR: any[]
  ): { and?: any[]; or?: any[] } | null {
    if (where && where.length > 0 && whereOR && whereOR.length > 0) {
      return { and: where, or: whereOR };
    } else if (where && where.length > 0) {
      return { and: where };
    } else if (whereOR && whereOR.length > 0) {
      return { or: whereOR };
    }
    return null;
  }

  getUserSaleList(id: string): Observable<UserSaleList> {
    const url = `${this.baseUrl}/user-sale-list/${id}`;

    return this.http.get(url).pipe(
      map((data: any) => data),
      shareReplay(1)
    );
  }
  // getConditionalSaleListLength(where: any): Observable<UserSaleList[]> {
  getConditionalUserSaleListLength() {
    let url: string;
    url = `${this.baseUrl}/user-sale-list/length` + this.where;
    // console.log('getConditionalSaleListLength', url, this.where);
    this.http.get(url).pipe(
      tap((data: any) => {
        this.localStorageService.setItem('searchItemsLength', data.toString())
        this.conditionalUserSaleListLength.set(data);
      })
    ).subscribe();
    // return this.http.get(url).pipe(map((data: any) => data));
  }
  createUserSaleList(data: Partial<UserSaleList>): Observable<UserSaleList> {
    const url = `${this.baseUrl}/user-sale-list`;
    return this.http
      .post(url, { data }, { headers: this.headers })
      .pipe(map((data: any) => data));
  }
  updateUserSaleList(
    id: string,
    data: Partial<UserSaleList>
  ): Observable<UserSaleList> {
    const url = `${this.baseUrl}/user-sale-list/${id}`;
    return this.http
      .patch(url, { data })
      .pipe(map((data: any) => data));
  }
  deleteUserSaleList(id: string): Observable<UserSaleList> {
    const url = `${this.baseUrl}/user-sale-list/${id}`;

    return this.http.delete(url).pipe(map((data: any) => data));
  }
}
