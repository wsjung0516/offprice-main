import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaleList } from 'src/app/core/models/sale-list.model';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SaleListService {
  baseUrl = environment.url;
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
  headers = { 'content-type': 'application/json'}; // 'Accept': 'application/json'
  getSaleLists(skip: number, take: number,  where?: any, whereOR?: any): Observable<SaleList[]> {
    let url: string;
    const data = {key: {where, whereOR}};
        /** data = {key: {
                        where:[{ category: 'pants', size:'SM'],
                        whereOR:[{vendor:{ contains: 'test'}}, {description:{ contains: 'test'}}]
                      }
                    }
        */

    const whereData = JSON.stringify(data);
    const order = JSON.stringify({created_at: 'desc'});
    console.log('whereData: ', where);
    // console.log('where: ', where);

    if( where && where.length > 0 || whereOR && whereOR.length > 0){
      url = `${this.baseUrl}/sale-list?skip=${skip}&take=${take}&orderBy=${order}&where=${whereData}`;
    }
    else{
      url = `${this.baseUrl}/sale-list?skip=${skip}&take=${take}&orderBy=${order}`;
    }
    return this.http.get(url).pipe(
      map((data: any) => data ),
      shareReplay(1)
    )
  }
  getSaleList(id: string): Observable<SaleList> {
    const url = `${this.baseUrl}/sale-list/${id}`;

    return this.http.get(url).pipe(
      map((data: any) => data ),
      shareReplay(1)
    )
  }
  // getConditionalSaleListLength(where: any): Observable<SaleList[]> {
  getConditionalSaleListLength(): Observable<number> {
    let url: string;
    url = `${this.baseUrl}/sale-list/length`;
    return this.http.get(url).pipe(
      map((data: any) => data ),
    )
  }
  createSaleList(data:Partial<SaleList>): Observable<SaleList> {
    const url = `${this.baseUrl}/sale-list`;
    return this.http.post(url, {data}, {headers: this.headers}).pipe(
      map((data: any) => data ),
    )
  }
  updateSaleList(id: string, data: Partial<SaleList>): Observable<SaleList> {
    const url = `${this.baseUrl}/sale-list/${id}`;
    return this.http.patch(url, {data}, {observe: 'response'}).pipe(
      map((data: any) => data ),
    )
  }
  deleteSaleList(id: string): Observable<SaleList> {
    const url = `${this.baseUrl}/sale-list/${id}`;

    return this.http.delete(url).pipe(
      map((data: any) => data ),
    )
  }
}