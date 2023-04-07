import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  last,
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
import { ShowMenuDialogService } from './show-menu-dialog.service';
import { SaleListService } from './../../modules/dashboard/components/sale-list/sale-list.service';
import { SaleList } from '../models/sale-list.model';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class MakeWhereConditionService {
  condition = new Subject<any>();

  resetImages = new Subject<any>();
  refreshObservable$: Observable<any>;
  displayMode = 'grid | list';

  //scrollObservable: BehaviorSubject<any>;
  // scrollObservable$: Observable<any>;

  scrollObservable = new BehaviorSubject<any>({
    skip: 0,
    take: 20,
  });
  scrollObservable$ = this.scrollObservable.asObservable();

  constructor(
    private saleListService: SaleListService,
    private showMenuDialogService: ShowMenuDialogService
  ) {
    // this.makeObservableService.makeWhereObservable();
    this.makeWhereObservable();
    setTimeout(() => {
      this.makeSortNWhereCondition().subscribe((data: any) => {
        // console.log('data:--------- ', data)
        this.condition.next(data);
      });
    }, 1000);
  }
  eventCount = 0;
  searchConditionObservable$: Observable<any>;

  get condition$(): Observable<any> {
    return this.condition.asObservable();
  }
  get resetImages$(): Observable<any> {
    return this.resetImages.asObservable();
  }
  setScrollObservable(value: any) {
    this.scrollObservable.next(value);
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
    let andArray: any[] = [];
    let orArray: any[] = [];

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
    } = this.showMenuDialogService;

    this.searchConditionObservable$ = combineLatest([
      vendor$,
      price$,
      category$,
      size$,
      material$,
      search_period$,
      input_keyword$,
    ]).pipe(
      untilDestroyed(this),
      tap(() => {
        this.displayMode = localStorage.getItem('displayMode');
        console.log('make-when displayMode', this.displayMode);
      }),
      filter(() => this.displayMode === 'grid'),
      map(this.buildWhereCondition),
      tap((val) => {
        this.eventCount++;
        // Whenever the where condition is changed, the scrollObservable is reset to the initial value.
        if (this.eventCount > 0) {
          // this.images = [];
          this.resetImages.next({
            images: [],
          });
          this.scrollObservable.next({
            skip: 0,
            take: 20,
          }); // this.oldScroll = { skip: 0, take: 20 };
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
  ]: [string, string, string, string, string, string, string]): {
    where: { and: any[]; or: any[] };
  } {
    const andArray: any[] = [];
    const orArray: any[] = [];
    // console.log('input_keyword', input_keyword)

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
    }
    return { where: { and: andArray, or: orArray } };
  }

  private makeSortNWhereCondition(): Observable<any> {
    return combineLatest([
      this.scrollObservable$.pipe(startWith({ skip: 0, take: 20 })),
      this.searchConditionObservable$,
    ]).pipe(
      untilDestroyed(this),
      map(([scrollData, searchData]) =>
        this.extractWhereAndScrollData(scrollData, searchData)
      ),
      switchMap((data: any) => this.fetchSaleLists(data))
    );
  }

  private extractWhereAndScrollData(
    scrollData: any,
    searchData: any
  ): {
    where: any[];
    whereOR: any[];
    scroll: {};
  } {
    // console.log('scrollData, searchData', scrollData, searchData)
    let where: any[] = [];
    let whereOR: any[] = [];
    let scroll: { skip: 0; take: 20 };

    if (searchData.where && searchData.where['and'].length > 0) {
      where = searchData.where['and'];
      // this.images = [];
    } else if (searchData.where && searchData.where['and'].length === 0) {
      where = null;
    }

    if (searchData.where && searchData.where['or'].length > 0) {
      whereOR = searchData.where['or'];
      // this.images = [];
    } else if (searchData.where && searchData.where['or'].length === 0) {
      whereOR = null;
    }

    if (scrollData) {
      scroll = scrollData;
    } else {
      scroll = { skip: 0, take: 20 };
    }
    return { where, whereOR, scroll };
  }

  private fetchSaleLists(data: any): Observable<any> {
    const { where, scroll, whereOR } = data;
    return this.saleListService.getSaleLists(
      scroll.skip,
      scroll.take,
      { created_at: 'desc' },
      where,
      whereOR
    );
  }
}
