import { DestroyRef, Injectable, inject } from '@angular/core';
import { from, groupBy, first, mergeMap, toArray, Observable, last, filter } from 'rxjs';
import { CartItems } from '../models/cart-items.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root'
})
export class FindFirstRowService {
  destroyRef = inject(DestroyRef);
  constructor() {}
  data = [
    { no: 1, aa: 1, bb: 3, cc: 1 },
    { no: 2, aa: 1, bb: 3, cc: 2 },
    { no: 3, aa: 1, bb: 4, cc: 3 },
    { no: 4, aa: 1, bb: 2, cc: 1 },
    { no: 5, aa: 1, bb: 2, cc: 3 },
    { no: 6, aa: 1, bb: 3, cc: 1 },
    { no: 7, aa: 1, bb: 4, cc: 3 },
    { no: 8, aa: 1, bb: 4, cc: 3 },
  ];

  findFirstRows(data: any[]): Observable<CartItems[]> {
    return from(data).pipe(
      takeUntilDestroyed(this.destroyRef),
      groupBy((row) => row.sale_list_id),
      mergeMap((group$) => group$.pipe(first())),
      filter((row) => row.quantity > 0),
      toArray()
    );
  }

  printFirstRows() {
    const lastRows$ = this.findFirstRows(this.data);

    lastRows$.subscribe({
      next(rows) {
        console.log('Last rows for each bb value:');
        console.log(rows);
      },
      error(err) {
        console.error('Error:', err);
      },
    });
  }
}
