import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { HomeComponent } from './home/home.component';
import { BehaviorSubject } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'angular-app';
  static isBrowser = new BehaviorSubject<boolean>(null);
  constructor(@Inject(PLATFORM_ID) private platformId: any,
  private metaTagService: Meta,
  private titleService: Title,) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
  }
  async ngOnInit() {
    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'off price clothes, off price sale, https://offprice.store',
      },
      { name: 'wholesale', content: 'offprice.store, https://offprice.store' },
      { name: 'author', content: 'Wonsup Jung' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'date', content: '2023-06-01', scheme: 'YYYY-MM-DD' },
      { charset: 'UTF-8' },
    ]);
  }
  // Logout after 30 minutes of inactivity
  ngAfterViewInit() {
    this.titleService.setTitle('wholesale clothes, off price store');
  }
}
