// session-storage.service.ts
import { Injectable } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

class LocalStorage implements Storage {
  [name: string]: any;
  readonly length: number;
  clear(): void {}
  getItem<T>(key: string): T | null {return undefined;}
  key(index: number): string | null {return undefined;}
  removeItem(key: string): void {}
  setItem(key: string, value: string): void {}
}
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService implements Storage {
  private storage: Storage;

  constructor() {
    this.storage = new LocalStorage();

    AppComponent.isBrowser.subscribe(isBrowser => {
      if (isBrowser) {
        this.storage = localStorage;
      }
    });
  }

  [name: string]: any;

  length: number;

  clear(): void {
    this.storage.clear();
  }

  getItem<T>(key: string): T | null {
    const value = this.storage.getItem(key);
    // console.log('value: ', value)
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch (e) {
        return value as any;
      }
    } else {
      return null;
    }
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeItem(key: string): void {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: any): void {
    return this.storage.setItem(key, JSON.stringify(value));
  }
  // constructor() { }

  // setItem(key: string, value: any): void {
  //   localStorage.setItem(key, JSON.stringify(value));
  // }

  // getItem<T>(key: string): T | null {
  //   const value = localStorage.getItem(key);
  //   if (value) {
  //     return JSON.parse(value) as T;
  //   }
  //   return null;
  // }

  // removeItem(key: string): void {
  //   localStorage.removeItem(key);
  // }

  // clear(): void {
  //   localStorage.clear();
  // }

}
