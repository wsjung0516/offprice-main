import {
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';
import { Injectable, signal } from '@angular/core';
import { filter, from, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  private _screenSize$: Observable<any>;
  itemSize = signal<number | undefined>(undefined);
  takeImage = signal<number>(20);

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(private breakpointObserver: BreakpointObserver) {
    this._screenSize$ = this.breakpointObserver
    //this.breakpointObserver
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
            tap((screenSize) => {
              if( screenSize === 'XSmall') {
                this.itemSize.set(100);
                this.takeImage.set(6);
              } else if (screenSize === 'Small') {
                this.itemSize.set(90);
                this.takeImage.set(12);
              } else if (screenSize === 'Medium') {
                this.itemSize.set(60);
                this.takeImage.set(16);
              } else if (screenSize === 'Large') {
                this.itemSize.set(60);
                this.takeImage.set(20);
              } else if (screenSize === 'XLarge') {
                this.itemSize.set(60);
                this.takeImage.set(24);
              }
            })
          );
        })
      );
  }
  get screenSize$() {
    return this._screenSize$;
  }
}
