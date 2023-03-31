import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map, Observable, takeUntil } from 'rxjs';
// import { Nft } from '../../models/sale-list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import {CategoryMenuComponent} from "../../category-menu/category-menu.component";
import {SaleListHeaderComponent} from "../../components/sale-list-header/sale-list-header.component";
// import {ISaleList} from "../../models/sale-list";
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
CommonModule,
    MatCardModule,
    SaleListHeaderComponent,
    CategoryMenuComponent
  ],

  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
})
export class SaleListComponent implements OnInit {
  // nft: Array<ISaleList>;
  currentScreenSize: string;
  public screenSize$: Observable<any>;
  sSize: string;

  constructor(private http: HttpClient,
    public screenSizeService: ScreenSizeService
    ) {
      this.screenSize$ = this.screenSizeService.screenSize$;
  }
  images: any;

  ngOnInit(): void {
    this.http.get('assets/json/images.json').subscribe((res:any) => {
      this.images = res.data;
      console.log(res);
    });
    this.screenSize$.pipe(
      untilDestroyed(this),
      )
      .subscribe((result) => {
        this.sSize = result;
      })

  }
}
