import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemsService } from './cart-items.service';
import { CartItems } from 'src/app/core/models/cart-items.model';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-items.component.html' ,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemsComponent implements OnInit, AfterViewInit {
  items: CartItems[] = [
  //   {
  //   "category": "Bags",
  //   "product_name": "Black Leather Bag",
  //   "vendor": "RF293",
  //   "price": "1,240",
  //   "count": "1",
  //   "size": "Medium",
  //   "material": "Leather",
  //   "image_url": "https://offprice_bucket.storage.googleapis.com/b1f3e70c-9989-11ec-8b85-027098eb172b_E_1681097442270.jpg"
  // }
]
  constructor(
    private cartItemsService: CartItemsService,
    private cd: ChangeDetectorRef,
    private sharedMenuObservableService: SharedMenuObservableService
    ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.cartItemsService.getCartItems({user_id: 'bbae7169-40cd-4a93-9f8d-b962b4906f88'})
    .subscribe((data) => {
      this.items = [...data];
      // console.log('this.items',this.items);
      this.cd.detectChanges();
      this.sharedMenuObservableService.cart_badge_count.next(this.items.length.toString());
    });

  }


}
