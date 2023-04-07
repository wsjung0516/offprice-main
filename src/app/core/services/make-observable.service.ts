import { Injectable } from '@angular/core';
import { ShowMenuDialogService } from 'src/app/core/services/show-menu-dialog.service';
import { BehaviorSubject, combineLatest, map, Observable, Subject, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class MakeObservableService {
  searchConditionObservable$: Observable<any>
  resetImages = new Subject<any>();
  get resetImages$(): Observable<any> {
    return this.resetImages.asObservable();
  }
  scrollObservable = new BehaviorSubject<any>({
    skip: 0, take: 20,
  });
  scrollObservable$ = this.scrollObservable.asObservable();
  setScrollObservable(value: any) {
    this.scrollObservable.next(value);
  }
  eventCount = 0;
  constructor(private showMenuDialogService: ShowMenuDialogService) { }
  makeWhereObservable() {
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
    ]).pipe(untilDestroyed(this), map(this.buildWhereCondition),
    tap((val) => {

      this.eventCount++;
      // Whenever the where condition is changed, the scrollObservable is reset to the initial value.
      if( this.eventCount > 0) {
        // this.images = [];
        this.resetImages.next({
          images: [],
        });
        this.scrollObservable.next({
          skip: 0, take: 20,
        });        // this.oldScroll = { skip: 0, take: 20 };
      }
    }));
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
    console.log('input_keyword', input_keyword)


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

}

