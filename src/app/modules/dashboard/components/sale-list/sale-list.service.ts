import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SaleList } from 'src/app/core/models/sale-list.model';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';

@Injectable({
  providedIn: 'root',
})
export class SaleListService {
  reservedWhere = '';
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
      this.reservedWhere = `?where=${JSON.stringify(whereData)}`;
    } else {
      const tmp = {AND: [{category1: '1'}]};
      this.reservedWhere = `?where=${JSON.stringify(tmp)}`;
    }
    // console.log('getSaleLists- url', url)
    return this.http
      .get<UserSaleList[]>(url)
      .pipe
      (
        // tap(data => console.log('response data: ', data)),
        // shareReplay(1)

      );
  }
  private buildWhereData(where: any[], whereOR: any[]): { and?: any[]; or?: any[] } | null {
    const and = where?.length > 0 ? where : undefined;
    const or = whereOR?.length > 0 ? whereOR : undefined;
    // console.log('build whereData: ', and, or);
    if (!and && !or) {
      return null;
    }
    return { and, or };
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
    url = `${this.baseUrl}/user-sale-list/length` + this.reservedWhere;
    // console.log('getConditionalSaleListLength url: ', url);
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
