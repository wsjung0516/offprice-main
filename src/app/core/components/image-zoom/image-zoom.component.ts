import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {DialogRef} from "@ngneat/dialog";
import { NgIf } from '@angular/common';
interface Data {
    image: string;
}
@Component({
    selector: 'app-image-zoom',
    template: `
      <ng-container *ngIf="ref">
          <div class="">
              <img class="object-cover" [src]="ref.data.image" alt="">
          </div>
      </ng-container>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf]
})
export class ImageZoomComponent implements OnInit {

  constructor(public ref: DialogRef<Data, boolean>) {
  }

  ngOnInit(): void {
  }

}
