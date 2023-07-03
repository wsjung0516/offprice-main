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
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HomeComponent, HelpComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'offprice-main';
  static isBrowser = new BehaviorSubject<boolean>(null);
  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private sEOService: SEOService,
    private metaTagService: Meta,
  ) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
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
  }
  // 
  ngAfterViewInit() {
    // this.titleService.setTitle('wholesale clothes, off price store');
  }
}
