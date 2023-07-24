import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CartItems } from 'src/app/core/models/cart-items.model';

@Injectable({
  providedIn: 'root',
})
export class SharedMenuObservableService {
  input_keyword = signal<string>('');
  vendor = signal<string>('All');
  price = signal<string>('All');
  category = signal<string>('All');
  category1 = signal<string>('All');
  size = signal<string>('All');
  material = signal<string>('All');
  search_period = signal<string>('All');
  color = signal<string>('All');


  // input_keyword = new BehaviorSubject<string>('');
  // input_keyword$ = this.input_keyword.asObservable();
  // vendor = new BehaviorSubject<string>('All');
  // vendor$ = this.vendor.asObservable();
  // price = new BehaviorSubject<string>('All');
  // price$ = this.price.asObservable();
  // category = new BehaviorSubject<string>('All');
  // category$ = this.category.asObservable();
  // category1 = new BehaviorSubject<string>('All');
  // category1$ = this.category1.asObservable();
  // size = new BehaviorSubject<string>('All');
  // size$ = this.size.asObservable();
  // material = new BehaviorSubject<string>('All');
  // material$ = this.material.asObservable();
  // search_period = new BehaviorSubject<string>('All');
  // search_period$ = this.search_period.asObservable();
  // color = new BehaviorSubject<string>('All');
  // color$ = this.color.asObservable();
  //
  reset_category = new Subject<string>();
  reset_category$ = this.reset_category.asObservable();
  reset_input_keyword = new Subject<string>();
  reset_input_keyword$ = this.reset_input_keyword.asObservable();
  reset_price = new Subject<string>();
  reset_price$ = this.reset_price.asObservable();
  reset_size = new Subject<string>();
  reset_size$ = this.reset_size.asObservable();
  reset_material = new Subject<string>();
  reset_material$ = this.reset_material.asObservable();
  reset_search_period = new Subject<string>();
  reset_search_period$ = this.reset_search_period.asObservable();
  reset_color = new Subject<string>();
  reset_color$ = this.reset_color.asObservable();
  //
  // cart_badge_count = signal<string>('');
  refreshCartItemsButton = signal<boolean>(false);
  closeCartItemsDialog = signal<boolean>(false);

  showMobileMenu = signal<boolean>(false);
  reset_register = new Subject<boolean>();
  reset_register$ = this.reset_register.asObservable();
  isLoggedOut = new Subject<boolean>();
  isLoggedOut$ = this.isLoggedOut.asObservable();
  resultDeleteSaleListItem = new Subject<string>();
  resultDeleteSaleListItem$ = this.resultDeleteSaleListItem.asObservable();
  userCoupons = new Subject<string>();
  userCoupons$ = this.userCoupons.asObservable();
  resetSearchConditions = new Subject<boolean>();
  resetSearchConditions$ = this.resetSearchConditions.asObservable();
  isImageLoading = new Subject<boolean>();
  isImageLoading$ = this.isImageLoading.asObservable();
  isProfileMenuOpen = new Subject<boolean>();
  isProfileMenuOpen$ = this.isProfileMenuOpen.asObservable();
  searchResult = new Subject<any[]>();
  searchResult$ = this.searchResult.asObservable();
  closeSideBar = new Subject<boolean>();
  closeSideBar$ = this.closeSideBar.asObservable();
  resetService() {}
}
