import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedMenuObservableService {
  input_keyword = new BehaviorSubject<string>('');
  vendor = new BehaviorSubject<string>('All');
  price = new BehaviorSubject<string>('All');
  category = new BehaviorSubject<string>('All');
  size = new BehaviorSubject<string>('All');
  material = new BehaviorSubject<string>('All');
  search_period = new BehaviorSubject<string>('All');
  color = new BehaviorSubject<string>('All');
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
  gotoHome = new Subject<string>();
  gotoHome$ = this.gotoHome.asObservable();
  displayName = new Subject<string>();
  displayName$ = this.displayName.asObservable();
  closeFeedback = new Subject<boolean>();
  closeFeedback$ = this.closeFeedback.asObservable();
  reset_register = new Subject<boolean>();
  reset_register$ = this.reset_register.asObservable();

  get input_keyword$() {
    return this.input_keyword.asObservable();
  }
  get vendor$() {
    return this.vendor.asObservable();
  }
  get price$() {
    return this.price.asObservable();
  }
  get category$() {
    return this.category.asObservable();
  }
  get size$() {
    return this.size.asObservable();
  }
  get material$() {
    return this.material.asObservable();
  }
  get search_period$() {
    return this.search_period.asObservable();
  }
  get color$() {
    return this.color.asObservable();
  }
  resetService() {
  }
}
