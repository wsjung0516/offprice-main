import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Nft } from '../../models/nft';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NftHeaderComponent } from './../../components/nft/nft-header/nft-header.component';

@Component({
  standalone: true,
  imports: [
  CommonModule,
    MatCardModule,
    NftHeaderComponent
  ],

  selector: 'app-nft',
  templateUrl: './nft.component.html',
})
export class NftComponent implements OnInit {
  nft: Array<Nft>;

  constructor(private http: HttpClient) {
  }
  images: any;

  ngOnInit(): void {
    this.http.get('assets/json/images.json').subscribe((res:any) => {
      this.images = res.data;
      console.log(res);
    });
  }
}
