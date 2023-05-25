import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  merge,
  Observable,
  skip,
  startWith,
  Subject,
  switchMap,
  tap,
  distinctUntilKeyChanged,
} from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedMenuObservableService } from './shared-menu-observable.service';
import { UserSaleListService } from '../../sale-list/user-sale-list.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { LocalStorageService } from './local-storage.service';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class MakeTableWhereConditionService {
  searchResult = new Subject<any>();

  sort: MatSort;
  paginator: MatPaginator;
  refreshObservable$: Observable<any>;
  private displayModeSubject = new BehaviorSubject<string>('grid');
  displayMode$: Observable<string> = this.displayModeSubject.asObservable();
  displayMode = '';

  constructor(
    //private makeObservableService: MakeObservableService,
    private sharedMenuObservableService: SharedMenuObservableService,
    private userSaleListService: UserSaleListService,
    private localStorageService: LocalStorageService
  ) {}
  eventCount = 0;
  searchConditionObservable$: Observable<any>;

  get searchResult$(): Observable<UserSaleList[]> {
    return this.searchResult.asObservable();
  }
  initializeWhereCondition(sort: MatSort, paginator: MatPaginator) {
    this.sort = sort;
    this.paginator = paginator;

    this.makeWhereObservable();

    setTimeout(() => {
      this.makeTableWhereCondition()
        .pipe(untilDestroyed(this))
        .subscribe((data: UserSaleList[]) => {
          // console.log('make-table-where', data);
          this.searchResult.next(data);
        });
      this.localStorageService.storageItem$
        .pipe(tap((item) => {}))
        .subscribe((item) => {
          if (item && item.key === 'displayMode') {
            // console.log('item', item);
            this.displayModeSubject.next(item.value);
          }
        });
    }, 100);
  }
  setRefreshObservable(refreshObservable: Observable<any>) {
    this.refreshObservable$ = refreshObservable;
  }
  resetSort() {
    if (!!this.sort) {
      this.sort.active = 'created_at';
      this.sort.direction = 'desc';
      this.sort.sortChange.emit({
        active: this.sort.active,
        direction: this.sort.direction,
      });
    }
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

  private makeWhereObservable() {

    /**
     * 1. display dialog menu (category, size, price, material, search period)
     * 2. select one item and call the behavior subject, which is at the service( shared-menu-observable.service)
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
      color$,
    } = this.sharedMenuObservableService;

    this.searchConditionObservable$ = combineLatest([
      // this.displayMode$,
      vendor$,
      price$,
      category$,
      size$,
      material$,
      search_period$,
      input_keyword$,
      color$,
    ]).pipe(
      untilDestroyed(this),
      tap((val) => {
        this.displayMode = localStorage.getItem('displayMode');
        this.paginator.firstPage();
        // console.log('make-table tap', val,this.displayMode);
      }),
      filter(() => this.displayMode === 'list'),
      // filter(([displayMode]) => displayMode === 'list'),
      map(this.buildWhereCondition)
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
    color,
  ]: [string, string, string, string, string, string, string, string]): {
    where: { and: any[]; or: any[] };
  } {
    const andArray: any[] = [];
    const orArray: any[] = [];

    if (vendor !== 'All') andArray.push({ vendor: vendor });
    if (price !== 'All') {
      const pric = price.split(',');
      andArray.push({ price: { gt: +pric[0], lt: +pric[1] } });
    }
    if (category !== 'All') andArray.push({ category: category });
    if (size !== 'All') andArray.push({ size: size });
    if (material !== 'All') andArray.push({ material: material });
    if (color !== 'All') andArray.push({ color: color });
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
      orArray.push({ store_name: { contains: input_keyword } });
      orArray.push({ product_name: { contains: input_keyword } });
      orArray.push({ color: { contains: input_keyword } });
      orArray.push({ size: { contains: input_keyword } });
      orArray.push({ material: { contains: input_keyword } });
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
        // where and condition event is triggered. (price, category, size, material, search_period)
        if (data.where && data.where['and'].length > 0) {
          where = data.where['and'];
        } else if (data.where && data.where['and'].length === 0) {
          where = [];
        }
        // where or condition event is triggered. (vendor, description)
        if (data.where && data.where['or'].length > 0) {
          whereOR = data.where['or'];
        } else if (data.where && data.where['or'].length === 0) {
          whereOR = [];
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
        return this.userSaleListService.getUserSaleLists(
          this.paginator.pageIndex * this.paginator.pageSize, // skip
          this.paginator.pageSize, // take
          orderBy,
          where, // where is used for AND condition (price, category, size, material, search_period)
          whereOR // whereOR is used for OR condition (vendor, description)
        );
      })
    );
  }
  resetService() {
    // this.sharedMenuObservableService..resetService();
  }
}
