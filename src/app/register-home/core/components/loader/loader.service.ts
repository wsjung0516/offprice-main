import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class LoaderService {

  isLoading = new Subject<boolean>();

  constructor() {
  }

  show() {
    console.log('laoader show')
     this.isLoading.next(true);
  }

  hide() {
     this.isLoading.next(false);
  }
}
