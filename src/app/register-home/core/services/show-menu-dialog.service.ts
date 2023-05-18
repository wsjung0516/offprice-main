import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShowMenuDialogService {
  input_keyword = new BehaviorSubject<string>('');
  vendor = new BehaviorSubject<string>('All');
  price = new BehaviorSubject<string>('All');
  category = new BehaviorSubject<string>('All');
  size = new BehaviorSubject<string>('All');
  material = new BehaviorSubject<string>('All');
  search_period = new BehaviorSubject<string>('All');

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
}
