import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storageItemSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public storageItem$: Observable<any> = this.storageItemSubject.asObservable();

  constructor() {}

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
    this.storageItemSubject.next({ key, value });
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.storageItemSubject.next(null);
  }
}
