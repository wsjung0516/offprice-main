import { Injectable, WritableSignal, computed, inject, signal, Injector } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedMenuObservableService } from './shared-menu-observable.service';
import { UserSaleListService } from '../../modules/dashboard/components/sale-list/user-sale-list.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UserSaleList } from 'src/app/core/models/user-sale-list.model';
import { LocalStorageService } from './local-storage.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Data } from './../../register-home/core/components/details-item/details-item.component';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class MakeTableWhereConditionService2 {
  searchResult = new Subject<any>();

  // sort: WritableSignal<MatSort> = signal(undefined);
  // paginator: WritableSignal<MatPaginator> = signal(undefined);
  sort: MatSort;
  paginator: MatPaginator;
  refreshObservable = new Subject<any>();
  refreshObservable$ = this.refreshObservable.asObservable();
  private displayModeSubject = new BehaviorSubject<string>('grid');
  displayMode$: Observable<string> = this.displayModeSubject.asObservable();
  displayMode = '';
  //
  sharedMenuObservableService = inject(SharedMenuObservableService);
  userSaleListService = inject( UserSaleListService);
  userSaleLists: any;

  injector = inject(Injector);
  


  constructor(
    //private makeObservableService: MakeObservableService,
    // private sharedMenuObservableService: SharedMenuObservableService,
    // private userSaleListService: UserSaleListService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService
  ) {
    // this.makeWhereObservable();
    if( this.sort && this.paginator) {
      const rData = toObservable(this.makeWhereCondition).pipe(
        switchMap((data: any) => {
          const { where, orderBy, whereOR } = data;
          return this.fetchUserSaleList(orderBy, where, whereOR);
        })
  
      )
      this.userSaleLists = toSignal(rData, {initialValue: [] as UserSaleList[]})

    } else {
      this.userSaleLists = signal([])
    }
  }
  eventCount = 0;
  // userSaleLists = signal<UserSaleList[]>([]);
  
  searchConditionObservable$: Observable<any>;

  // get searchResult$(): Observable<UserSaleList[]> {
  //   return this.searchResult.asObservable();
  // }
  initializeWhereCondition(sort: MatSort, paginator: MatPaginator) {
    this.sort = sort;
    this.paginator = paginator;
    // Because of the timing issue, we need to use setTimeout.
    setTimeout(() => {

      this.makeTableWhereCondition()
        .pipe(untilDestroyed(this))
        .subscribe((data: UserSaleList[]) => {
          // console.log('make-table-where', data);
          // 
          // this.userSaleLists.set(data);
          // this.userSaleListService.getConditionalUserSaleListLength();

        });
      this.localStorageService.storageItem$
        .pipe(tap((item) => {}))
        .subscribe((item) => {
          if (item && item.key === 'displayMode') {
            // console.log('item', item);
            this.displayModeSubject.next(item.value);
          }
        });
    }, 0);
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
  3:{category1: '1'}
  4:{size: 'XS'}
  5:{material: 'Wool'}
  6:{search_period: 2}
  7:{input_keyword: 'aaa'}
  */
  vendor = this.sharedMenuObservableService.vendor;
  price = this.sharedMenuObservableService.price;
  category = this.sharedMenuObservableService.category;
  category1 = this.sharedMenuObservableService.category1;
  size = this.sharedMenuObservableService.size;
  material = this.sharedMenuObservableService.material;
  search_period = this.sharedMenuObservableService.search_period;
  input_keyword = this.sharedMenuObservableService.input_keyword;
  color = this.sharedMenuObservableService.color;

  searchCond = computed( () => {
    return {
      vendor: this.vendor(),
      price: this.price(),
      category: this.category(),
      category1: this.category1(),
      size: this.size(),
      material: this.material(),
      search_period: this.search_period(),
      input_keyword: this.input_keyword(),
      color: this.color(),
    };
  })

  searchCondition = computed(() => {
    return this.buildWhereCondition(this.searchCond());
  })
  makeWhereCondition = computed(() => {
    return this.makeTableWhereCondition()
  })


  /**
   * 1. display dialog menu (category, size, price, material, search period)
   * 2. select one item and call the behavior subject, which is at the service( show-menu-dialog.service)
   * 3. get the value from the behavior subject as below.
   * 4. combine all the behavior subject and make the where condition.
   */



  oldOrderBy: any = {};
  private makeTableWhereCondition(): Observable<any> {
    // let where: any[] = [];
    // let whereOR: any[] = [];
    // let orderBy: {} = null;
    console.log('sort pagenator', this.sort, this.paginator)
    return merge(
      this.sort.sortChange,
      this.paginator.page,
      toObservable(this.searchCondition, {injector: this.injector}),
      // this.searchConditionObservable$,
      this.refreshObservable$
    ).pipe(
      untilDestroyed(this),
      // skip(1),
      // startWith({}),
      map((data) =>this.makeCondition(data)),
      // switchMap((data: any) => {
      //   const { where, orderBy, whereOR } = data;
      //   return this.fetchUserSaleList(orderBy, where, whereOR);
      // })
    );
  }
  private makeCondition(data: any) {
    let where: any[] = [];
    let whereOR: any[] = [];
    let orderBy: {} = null;

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
  }
  //
  private buildWhereCondition(source: any): {
    where: { and: any[]; or: any[] };
  } {
    const andArray: any[] = [];
    const orArray: any[] = [];
    // console.log('buildWhereCondition', vendor, price, category, category1, size, material, search_period, input_keyword, color);
    andArray.push({ category1: source.category1 });
    andArray.push({ status1: 'Sale' });
    if (source.vendor !== 'All') andArray.push({ vendor: source.vendor });
    if (source.price !== 'All') {
      const pric = source.price.split(',');
      andArray.push({ price: { gt: +pric[0], lt: +pric[1] } });
    }
    if (source.category !== 'All') andArray.push({ category: source.category });
    if (source.size !== 'All') andArray.push({ size: { contains: source.size } });
    if (source.material !== 'All') andArray.push({ material: { contains: source.material } });
    if (source.color !== 'All') andArray.push({ color: { contains: source.color } });
    if (source.search_period !== 'All') {
      const day: number = +source.search_period;
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
    if (source.input_keyword !== '') {
      orArray.push({ product_name: { contains: source.input_keyword } });
      orArray.push({ vendor: { contains: source.input_keyword } });
      orArray.push({ description: { contains: source.input_keyword } });
      orArray.push({ store_name: { contains: source.input_keyword } });
      orArray.push({ color: { contains: source.input_keyword } });
      orArray.push({ size: { contains: source.input_keyword } });
      orArray.push({ material: { contains: source.input_keyword } });
    }

    return { where: { and: andArray, or: orArray } };
  }
  private fetchUserSaleList(orderBy: any, where: any, whereOR: any): Observable<UserSaleList[]> {
    return this.userSaleListService.getUserSaleLists(
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageSize,
      orderBy,
      where,
      whereOR
    );
  }
}
