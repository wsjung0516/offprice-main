import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SoldSaleList } from 'src/app/core/models/sale-list.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoldRecordsService {
  reservedWhere = '';
  baseUrl = environment.url;
  constructor(private http: HttpClient) {}
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'
  getSoldRecords(
    skip: number,
    take: number,
    orderBy?: any,
    where?: any,
    whereOR?: any
  ): Observable<SoldSaleList[]> {
    // console.log('getSaleList', skip, take, orderBy, where, whereOR)
    const whereData = this.buildWhereData(where, whereOR);

    const order = JSON.stringify(orderBy);
    let url = `${this.baseUrl}/sold-sale-list?skip=${skip}&take=${take}&orderBy=${order}`;
    if (whereData) {
      url += `&where=${JSON.stringify(whereData)}`;
      this.reservedWhere = `?where=${JSON.stringify(whereData)}`;
    } else {
      const tmp = { AND: [{ category1: '1' }] };
      this.reservedWhere = `?where=${JSON.stringify(tmp)}`;
    }
    // console.log('getSaleLists- url', url)
    return this.http
      .get<SoldSaleList[]>(url)
      .pipe
      // tap(data => console.log('response data: ', data)),
      // shareReplay(1)
      ();
  }
  private buildWhereData(
    where: any[],
    whereOR: any[]
  ): { and?: any[]; or?: any[] } | null {
    const and = where?.length > 0 ? where : undefined;
    const or = whereOR?.length > 0 ? whereOR : undefined;
    // console.log('build whereData: ', and, or);
    if (!and && !or) {
      return null;
    }
    return { and, or };
  }
}
