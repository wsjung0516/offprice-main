// import { ChangeDetectionStrategy, Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-menu-detail-component',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <p>
//       menu-detail-component works!
//     </p>
//   `,
//   styles: [
//   ],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class ShowMenuDialogComponentComponent {

// }

import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  AfterViewInit,
  ChangeDetectorRef,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PriceRangeComponent } from '../price-range/price-range.component';
interface Data {
  image: string;
}

@Component({
  selector: 'app-menu-detail-component',
  standalone: true,
  imports: [CommonModule],
template: `
    <div align="end" class="button-position">
      <button class="button" (click)="onClose()">X</button>
    </div>
    <div class="frame">
      <div class="header">
        <h1>{{ data.title }}</h1>
      </div>
      <div #menu class="body"></div>
    </div>
  `,
  styles: [
    `
      .frame {
        width: 100%;
        height: 100%;
        background-color: #f1f1f1;
      }
      .header {
        height: 2rem;
        background-color: #f5f5f5;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        padding-top: 0.5rem;
      }
      .button {
        background-color: #f5f5f5; /* Green */
        border: none;
        color: black;
        padding: 2px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 5px;
        position: absolute;
        top: 10px;
        right: 10px;
      }
      .body {
        padding-top: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowMenuDialogComponent implements AfterViewInit {
  @ViewChild('menu', { read: ViewContainerRef }) menu: ViewContainerRef;
  constructor(
    public dialogRef: MatDialogRef<ShowMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { component: ComponentType<PriceRangeComponent>; title: string },
    private _cd: ChangeDetectorRef
  ) {}
  ngAfterViewInit() {
    const componentRef = this.menu.createComponent(this.data.component);
    componentRef.instance.dialogRef = this.dialogRef;
    this._cd.detectChanges();
  }
  onClose() {
    const data = {
      success: true,
      message: 'success',
    };
    this.dialogRef.close();
  }
}
