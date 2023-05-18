import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'  
})
export class SharedParentObservableService {
  isProfileMenuOpen = new Subject<boolean>();
  isProfileMenuOpen$ = this.isProfileMenuOpen.asObservable();
}