import {
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { filter, from, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  private _screenSize$: Observable<any>;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(private breakpointObserver: BreakpointObserver) {
    this._screenSize$ = this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(
        untilDestroyed(this),
        switchMap((screenSize: any) => {
          return from(Object.keys(screenSize.breakpoints)).pipe(
            filter((key: any) => screenSize.breakpoints[key]),
            map((key) => this.displayNameMap.get(key)), // 'XSmall', 'Small', 'Medium', 'Large', 'XLarge'
          );
        })
      );
  }
  get screenSize$() {
    return this._screenSize$;
  }
}
