import { Injectable, signal, computed, inject, effect, Injector } from '@angular/core';
import {
  Observable,
  switchMap,
} from 'rxjs';
import { SharedMenuObservableService } from './shared-menu-observable.service';
import { SaleListService } from '../../modules/dashboard/components/sale-list/sale-list.service';
import { SaleList } from '../models/sale-list.model';
import { toObservable, toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScreenSizeService } from './screen-size.service';

@Injectable({
  providedIn: 'root',
})
export class MakeWhereConditionService2 {

  sharedMenuObservableService = inject(SharedMenuObservableService);
  screenSizeService = inject(ScreenSizeService);
  saleListService = inject(SaleListService);
  injector = inject(Injector);

  takeImage = this.screenSizeService.takeImage; // takeImage = signal<number>(20);

  scrollData = signal<any | undefined>({
    skip: 0,
    take: this.takeImage(),
  });
  images = signal<SaleList[]>([]);


  vendor = this.sharedMenuObservableService.vendor;
  price = this.sharedMenuObservableService.price;
  category = this.sharedMenuObservableService.category;
  category1 = this.sharedMenuObservableService.category1;
  size = this.sharedMenuObservableService.size;
  material = this.sharedMenuObservableService.material;
  search_period = this.sharedMenuObservableService.search_period;
  input_keyword = this.sharedMenuObservableService.input_keyword;
  color = this.sharedMenuObservableService.color;

  searchCond = computed(() => {
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
  });
  searchCondition = computed(() => {
    return this.buildWhereCondition(this.searchCond())
  });
  makeWhereCondition = computed(() => {
    return this.extractWhereAndScrollData(this.scrollData(), this.searchCondition());
  })
  
  imageData: any;

  constructor() {
    const rData = toObservable(this.makeWhereCondition, {injector: this.injector}).pipe(
      switchMap((data) => this.fetchSaleLists(data))
    )
    this.imageData = toSignal(rData, {initialValue: [] as SaleList[]});

    // To reset search condition whenever new action of search is tried.  
    toObservable(this.searchCondition).pipe(
      takeUntilDestroyed()
    ).subscribe((data: any) => {
      this.scrollData.set({ skip: 0, take: this.takeImage() });
      this.images.set([]);
      // console.log('searchCondition data:------------ ')
      this.saleListService.getConditionalSaleListLength();
    });
    effect(() => {
      this.images.update( (items: SaleList[]) => [...items, ...this.imageData()])
    }, { allowSignalWrites: true})

  }

  private buildWhereCondition(source:any): {
    where: { and: any[]; or: any[] };
  } {
    // console.log('buildWhereCondition', source)
    const andArray: any[] = [];
    const orArray: any[] = [];

    andArray.push({ category1: source.category1 });
    andArray.push({ status1: 'Sale' });
    if (source.vendor !== 'All') andArray.push({ vendor: source.vendor });
    if (source.price !== 'All') {
      const pric = source.price.split(',');
      andArray.push({ price: { gt: +pric[0], lt: +pric[1] } });
      // console.log(' andArray', andArray)
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
      // console.log('source.input_keyword', source.input_keyword);
      orArray.push({ vendor: { contains: source.input_keyword } });
      orArray.push({ store_name: { contains: source.input_keyword } });
      orArray.push({ product_name: { contains: source.input_keyword } });
      orArray.push({ description: { contains: source.input_keyword } });
      orArray.push({ color: { contains: source.input_keyword } });
      orArray.push({ size: { contains: source.input_keyword } });
      orArray.push({ material: { contains: source.input_keyword } });
    }

    return { where: { and: andArray, or: orArray } };
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
    let scroll = { skip: 0, take: this.takeImage() };

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
      scroll = { skip: 0, take: this.takeImage() };
    }
    return { where, whereOR, scroll };
  }

  private fetchSaleLists(data: any): Observable<any> {
    const { where, scroll, whereOR } = data;
    // console.log('fetchSaleLists scrollData', where,scroll,whereOR)
    return this.saleListService.getSaleLists(
      scroll.skip,
      scroll.take,
      { created_at: 'desc' },
      where,
      whereOR
    )
  }
  resetService() {
    // this.sharedMenuObservableService
  }
}
