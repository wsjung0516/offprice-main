import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaleList } from 'src/app/core/models/sale-list.model';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SaleListService {
  baseUrl = environment.url;
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'

  getSaleTableLists(
    skip: number,
    take: number,
    orderBy?: any,
    where?: any[],
    whereOR?: any[]
  ): Observable<SaleList[]> {
    const whereData = this.buildWhereData(where, whereOR);
    const order = JSON.stringify(orderBy);
    let url = `${this.baseUrl}/sale-list?skip=${skip}&take=${take}&orderBy=${order}`;
    if (whereData) {
      url += `&where=${JSON.stringify(whereData)}`;
    }
    return this.http.get<SaleList[]>(url).pipe(
      tap((data) => console.log('data: ----', data))
      // shareReplay(1)
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

  getSaleList(id: string): Observable<SaleList> {
    const url = `${this.baseUrl}/sale-list/${id}`;

    return this.http.get<SaleList>(url).pipe(
      map((data) => data),
      shareReplay(1)
    );
  }
  // getConditionalSaleListLength(where: any): Observable<SaleList[]> {
  getConditionalSaleListLength(): Observable<number> {
    const url = `${this.baseUrl}/sale-list/length`;
    return this.http.get<number>(url).pipe(map((data) => data));
  }
  createSaleList(data: Partial<SaleList>): Observable<SaleList> {
    const url = `${this.baseUrl}/sale-list`;
    return this.http
      .post<SaleList>(url, { data }, { headers: this.headers })
      .pipe(map((data) => data));
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
  deleteImageFromBucket(id: string): Observable<SaleList> {
    const url = `${this.baseUrl}/delete-image/offprice_bucket/${id}`;

    return this.http.delete(url).pipe(map((data: any) => data));
  }
  isReservedSaleItem(id: string): Observable<SaleList> {
    const url = `${this.baseUrl}/cart-items/is-reserve/${id}`;

    return this.http.get(url).pipe(map((data: any) => data));
  }
}
