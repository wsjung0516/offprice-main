import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaleList } from 'src/app/core/models/sale-list.model';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';

@Injectable({
  providedIn: 'root',
})
export class SaleListService {
  baseUrl = environment.url;
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'
  getSaleLists(
    skip: number,
    take: number,
    orderBy?: any,
    where?: any,
    whereOR?: any
  ): Observable<UserSaleList[]> {
    // console.log('getSaleList', skip, take, orderBy, where, whereOR)
    const whereData = this.buildWhereData(where, whereOR);

    const order = JSON.stringify(orderBy);
    let url = `${this.baseUrl}/user-sale-list?skip=${skip}&take=${take}&orderBy=${order}`;
    if (whereData) {
      url += `&where=${JSON.stringify(whereData)}`;
    }
    // console.log('getSaleLists- url', url)
    return this.http
      .get<UserSaleList[]>(url)
      .pipe
      // tap(data => console.log('data: ', data)),
      // shareReplay(1)
      ();
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

  getSaleList(id: string): Observable<SaleList> {
    const url = `${this.baseUrl}/sale-list/${id}`;

    return this.http.get(url).pipe(
      map((data: any) => data)
      // shareReplay(1)
    );
  }
  // getConditionalSaleListLength(where: any): Observable<SaleList[]> {
  getConditionalSaleListLength(): Observable<number> {
    let url: string;
    url = `${this.baseUrl}/user-sale-list/length`;
    return this.http.get(url).pipe(map((data: any) => data));
  }
  createSaleList(data: Partial<SaleList>): Observable<SaleList> {
    const url = `${this.baseUrl}/sale-list`;
    return this.http
      .post(url, { data }, { headers: this.headers })
      .pipe(map((data: any) => data));
  }
  updateSaleList(id: string, data: Partial<SaleList>): Observable<SaleList> {
    const url = `${this.baseUrl}/sale-list/${id}`;
    return this.http
      .patch(url, { data }, { observe: 'response' })
      .pipe(map((data: any) => data));
  }
  deleteSaleList(id: string): Observable<SaleList> {
    const url = `${this.baseUrl}/sale-list/${id}`;

    return this.http.delete(url).pipe(map((data: any) => data));
  }
}
