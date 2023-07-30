import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

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

  reset_category = signal<string | undefined>(undefined);
  reset_input_keyword = signal<string | undefined>(undefined);
  reset_price = signal<string | undefined>(undefined);
  reset_size = signal<string | undefined>(undefined);
  reset_material = signal<string | undefined>(undefined);
  reset_search_period = signal<string | undefined>(undefined);
  reset_color = signal<string | undefined>(undefined);
  // cart_badge_count = signal<string>('');
  refreshCartItemsButton = signal<boolean>(false);
  closeCartItemsDialog = signal<boolean>(false);
  showMobileMenu = signal<boolean>(false);

  resultDeleteSaleListItem = new Subject<string>();
  resultDeleteSaleListItem$ = this.resultDeleteSaleListItem.asObservable();
  // resultDeleteSaleListItem = signal<string>('');
  userCoupons = signal<string>('');
  searchResult = signal<any[]>([]);
  // reset_register = signal<boolean>(false);
  // isLoggedOut = signal<boolean>(false);
  resetSearchConditions = signal<boolean>(false);
  isImageLoading = signal<boolean>(false);
  isProfileMenuOpen = signal<boolean>(false);
  closeSideBar = signal<boolean>(false);

  resetService() {}
}
