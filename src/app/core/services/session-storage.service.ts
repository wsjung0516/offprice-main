// session-storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value) as T;
    }
    return null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
  // setItem(key: string, value: any): void {
  //   sessionStorage.setItem(key, JSON.stringify(value));
  // }

  // getItem<T>(key: string): T | null {
  //   const value = sessionStorage.getItem(key);
  //   if (value) {
  //     return JSON.parse(value) as T;
  //   }
  //   return null;
  // }

  // removeItem(key: string): void {
  //   sessionStorage.removeItem(key);
  // }

  // clear(): void {
  //   sessionStorage.clear();
  // }
}
