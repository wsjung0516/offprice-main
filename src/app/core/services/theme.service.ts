import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public default = 'light';
  public themeChanged: BehaviorSubject<string> = new BehaviorSubject(this.theme);

  constructor(
    private sessionStorageService: SessionStorageService
  ) {}

  public get theme(): string {
    return this.sessionStorageService.getItem('theme') ?? this.default;
  }

  public set theme(value: string) {
    this.sessionStorageService.setItem('theme', value);
    this.themeChanged.next(value);
  }

  public get isDark(): boolean {
    return this.theme == 'dark';
  }
}
