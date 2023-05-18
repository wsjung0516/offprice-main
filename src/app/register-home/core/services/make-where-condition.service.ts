import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  merge,
  Observable,
  skip,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SaleListService } from 'src/app/register-home/sale-list/sale-list.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SaleList } from '../models/sale-list.model';
import { SharedMenuObservableService } from './shared-menu-observable.service';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class MakeWhereConditionService {
  searchResult = new Subject<any>();
  resetImages = new Subject<any>();
  sort: MatSort;
  paginator: MatPaginator;
  refreshObservable$: Observable<any>;

  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private saleListService: SaleListService
  ) {}
  eventCount = 0;
  searchConditionObservable$: Observable<any>;

  get searchResult$(): Observable<SaleList[]> {
    return this.searchResult.asObservable();
  }
  /**
  0:{vendor: 'All'}
  1:{price: '10, 25'}
  2:{category: 'Tops'}
  3:{size: 'XS'}
  4:{material: 'Wool'}
  5:{search_period: 2}
  6:{input_keyword: 'aaa'}
  */
  initializeWhereCondition(sort: MatSort, paginator: MatPaginator) {
    this.sort = sort;
    this.paginator = paginator;
    this.makeWhereObservable();
    setTimeout(() => {
      this.makeTableWhereCondition().subscribe((data: SaleList[]) => {
        // console.log('data-2', data);
        this.searchResult.next(data);
      });
    }, 100);
  }
  setRefreshObservable(refreshObservable: Observable<any>) {
    this.refreshObservable$ = refreshObservable;
  }

  private makeWhereObservable() {
    // let andArray: any[] = [];
    // let orArray: any[] = [];
    /**
     * 1. display dialog menu (category, size, price, material, search period)
     * 2. select one item and call the behavior subject, which is at the service( show-menu-dialog.service)
     * 3. get the value from the behavior subject as below.
     * 4. combine all the behavior subject and make the where condition.
     */
    const {
      vendor$,
      price$,
      category$,
      size$,
      material$,
      search_period$,
      input_keyword$,
      color$
    } = this.sharedMenuObservableService;

    this.searchConditionObservable$ = combineLatest([
      vendor$,
      price$,
      category$,
      size$,
      material$,
      search_period$,
      input_keyword$,
      color$
    ]).pipe(
      untilDestroyed(this),
      map(this.buildWhereCondition),
      tap((val) => {
        //console.log('val', val);
        this.eventCount++;
        // Whenever the where condition is changed, the scrollObservable is reset to the initial value.
        if (this.eventCount > 0) {
          // this.images = [];
          this.resetImages.next({
            images: [],
          });
        }
      })
    );
  }

  private buildWhereCondition([
    vendor,
    price,
    category,
    size,
    material,
    search_period,
    input_keyword,
    color
  ]: [string, string, string, string, string, string, string, string]): {
    where: { and: any[]; or: any[] };
  } {
    const andArray: any[] = [];
    const orArray: any[] = [];
    // console.log('input_keyword', input_keyword);

    if (vendor !== 'All') andArray.push({ vendor: vendor });
    if (price !== 'All') {
      const pric = price.split(',');
      andArray.push({ price: { gt: +pric[0], lt: +pric[1] } });
    }
    if (category !== 'All') andArray.push({ category: category });
    if (size !== 'All') andArray.push({ size: size });
    if (material !== 'All') andArray.push({ material: material });
    if (search_period !== 'All') {
      const day: number = +search_period;
      andArray.push({
        created_at: {
          gte: new Date(
            new Date(new Date().setDate(new Date().getDate() - day))
              .toISOString()
              .substring(0, 10)
          ),
        },
      });
    }
    if (input_keyword !== '') {
      orArray.push({ vendor: { contains: input_keyword } });
      orArray.push({ description: { contains: input_keyword } });
      orArray.push({ product_name: { contains: input_keyword } });
      orArray.push({ store_name: { contains: input_keyword } });
    }
    return { where: { and: andArray, or: orArray } };
  }
  oldOrderBy: any = {};
  private makeTableWhereCondition(): Observable<any> {
    let where: any[] = [];
    let whereOR: any[] = [];
    let orderBy: {} = null;
    return merge(
      this.sort.sortChange,
      this.paginator.page,
      this.searchConditionObservable$,
      this.refreshObservable$
    ).pipe(
      untilDestroyed(this),
      skip(1),
      startWith({}),
      map((data: any) => {
        // console.log('data', data);
        // where and condition event is triggered. (price, category, size, material, search_period)
        if (data.where && data.where['and'].length > 0) {
          where = data.where['and'];
        } else if (data.where && data.where['and'].length === 0) {
          where = null;
        }
        // where or condition event is triggered. (vendor, description)
        if (data.where && data.where['or'].length > 0) {
          whereOR = data.where['or'];
        } else if (data.where && data.where['or'].length === 0) {
          whereOR = null;
        }
        // sort event is triggered.
        if (data.active && data.direction) {
          orderBy = { [data.active]: data.direction };
          this.oldOrderBy = orderBy;
        } else {
          if (Object.keys(this.oldOrderBy).length > 0) {
            // if there is old order
            orderBy = this.oldOrderBy; // keep the old order
          } else {
            orderBy = { created_at: 'desc' };
          }
        }
        return { where, whereOR, orderBy };
      }),
      switchMap((data: any) => {
        const { where, orderBy, whereOR } = data;
        return this.saleListService.getSaleTableLists(
          this.paginator.pageIndex * this.paginator.pageSize, // skip
          this.paginator.pageSize, // take
          orderBy,
          where, // where is used for AND condition (price, category, size, material, search_period)
          whereOR // whereOR is used for OR condition (vendor, description)
        );
      })
    );
  }
}
