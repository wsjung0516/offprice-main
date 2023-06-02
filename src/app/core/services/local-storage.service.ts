import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storageItemSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public storageItem$: Observable<any> = this.storageItemSubject.asObservable();

  constructor(private sessionStorageService: SessionStorageService) {}

  setItem(key: string, value: string): void {
    this.sessionStorageService.setItem(key, value);
    this.storageItemSubject.next({ key, value });
  }

  getItem(key: string): string | null {
    return this.sessionStorageService.getItem(key);
  }

  removeItem(key: string): void {
    this.sessionStorageService.removeItem(key);
    this.storageItemSubject.next(null);
  }
}
