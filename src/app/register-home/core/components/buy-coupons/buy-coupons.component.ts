import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserCouponsService } from 'src/app/core/services/user-coupons.service';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
export type CouponPrice = {
  price: number;
  coupon: number;

}
@Component({
  selector: 'app-buy-coupons',
  standalone: true,
  imports: [
  CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    FormsModule
  
  ],
  templateUrl: './buy-coupons.component.html',
  styles: [
    `
    .buy-coupons-group {
      display: flex;
      flex-direction: column;
      margin: 14px 0;
      align-items: flex-start;
    }
    .buy-button {
      background-color: #4CAF50; /* Green */
      border: none;
      color: white;
      padding: 10px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 8px;
    }

    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuyCouponsComponent {
  constructor(
    private userCouponsService: UserCouponsService,
    private cd: ChangeDetectorRef
  ) {}
  @Input() dialogRef: MatDialogRef<BuyCouponsComponent>;
  selectedCoupon: any = null;
  prices: CouponPrice[] = [
    { coupon: 50,  price: 50 },
    { coupon: 100, price: 95 },
    { coupon: 200, price: 180 },
    { coupon: 300, price: 255 },
    { coupon: 400, price: 320 },
    { coupon: 500, price: 375 },
  ]
  buyCoupons() {
    // this.userCouponsService..buyCoupons(this.selectedPrice);
    this.dialogRef.close();
  } 
}
