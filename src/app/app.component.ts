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
import { SEOService } from './core/services/SEO.service';
import { Meta } from '@angular/platform-browser';
import { HelpComponent } from './core/components/help/help.component';
import { NavigationEnd, Router } from '@angular/router';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { SessionStorageService } from './core/services/session-storage.service';
import { AuthService } from './core/auth/login/services/auth.service';
import { UserId } from './core/models/user.model';
import { CartItemsService } from './core/components/cart-items/cart-items.service';

declare const gtag: Function;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HomeComponent, HelpComponent,
  NgxGoogleAnalyticsModule,
     NgxGoogleAnalyticsRouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'offprice-main';
  static isBrowser = new BehaviorSubject<boolean>(null);
  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private sEOService: SEOService,
    private metaTagService: Meta,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private authService: AuthService,
  ) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
    const userId: UserId = this.sessionStorageService.getItem('userId');
    if(userId) {
      // console.log('userId: ', userId)
      this.authService.user.set(userId)
    } else {
      this.authService.user.set(undefined);
    }

  }
  async ngOnInit() {
    this.sEOService.updateTitle('wholesale clothes, off price store');
    this.sEOService.updateDescription('[Closeout, Clearance, Wholesale, Off price] offPrice.store is an online wholesale marketplace that sells clothes in bulk at low prices. Customers can easily and quickly search for and purchase products.');
    this.sEOService.createCanonicalLink('https://offprice.store');
    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: '[Closeout, Clearance, Wholesale, Off price] offPrice.store is an online wholesale marketplace that sells clothes in bulk at low prices. Customers can easily and quickly search for and purchase products.',
      },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Wonsup Jung' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'date', content: '2023-06-01', scheme: 'YYYY-MM-DD' },
      { charset: 'UTF-8' },
    ]);
    this.applyGoogleAnalytics();
  }
  // 
  ngAfterViewInit() {
    // this.titleService.setTitle('wholesale clothes, off price store');
  }
  private applyGoogleAnalytics() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-DXVCXF9X63', { 'page_path': event.urlAfterRedirects });
      }      
    })
  }
}
