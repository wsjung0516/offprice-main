import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map, Observable, takeUntil } from 'rxjs';
import { Nft } from '../../models/nft';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NftHeaderComponent } from './../../components/nft/nft-header/nft-header.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
  CommonModule,
    MatCardModule,
    NftHeaderComponent,
  ],

  selector: 'app-nft',
  templateUrl: './nft.component.html',
})
export class NftComponent implements OnInit {
  nft: Array<Nft>;
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
