import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs';
import { Nft } from '../../models/nft';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NftHeaderComponent } from './../../components/nft/nft-header/nft-header.component';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
  CommonModule,
    MatCardModule,
    NftHeaderComponent,
    LayoutModule,
  ],

  selector: 'app-nft',
  templateUrl: './nft.component.html',
})
export class NftComponent implements OnInit {
  nft: Array<Nft>;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  currentScreenSize: string;
  constructor(private http: HttpClient, private breakpointObserver: BreakpointObserver) {
  }
  images: any;

  ngOnInit(): void {
    this.http.get('assets/json/images.json').subscribe((res:any) => {
      this.images = res.data;
      console.log(res);
    });
    // this.breakpointObserver.pipe().subscribe((val:any)=>console.log('breakPoint',val));
    this.breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(untilDestroyed(this))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
        }
      }
    });
  }
}
