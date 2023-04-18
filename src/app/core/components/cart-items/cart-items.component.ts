import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemsService } from './cart-items.service';
import { CartItems } from 'src/app/core/models/cart-items.model';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { FindFirstRowService } from 'src/app/core/services/find-first-row.service';
import { switchMap } from 'rxjs';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [CommonModule],
templateUrl: './cart-items.component.html' ,
  styles: [`
    .container {
      height: 100vh;
    }
  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemsComponent implements OnInit, AfterViewInit {
  items: CartItems[] = [];
  constructor(
    private cartItemsService: CartItemsService,
    private cd: ChangeDetectorRef,
    private sharedMenuObservableService: SharedMenuObservableService,
    private findFirstRowService: FindFirstRowService,
    private sessionStorageService: SessionStorageService
    ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    const profile:any = this.sessionStorageService.getItem('userProfile');
    console.log('cart-items-profile',profile)
    this.cartItemsService.getCartItems({user_id:profile.id}).pipe(
      switchMap((data: any[]) => {
        return this.findFirstRowService.findFirstRows(data);
      })
    ).subscribe((items: CartItems[]) => {
      this.items = items;
      this.cd.detectChanges();
      this.sharedMenuObservableService.cart_badge_count.next(items.length.toString());
    })
  }
}
