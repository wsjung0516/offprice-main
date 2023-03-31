import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MenuService } from 'src/app/core/services/menu.service';
import { Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import { SearchKeywordService } from 'src/app/core/services/search-keyword.service';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  selector: 'app-sale-list-header',
  templateUrl: './nft-header.component.html',
})
export class NftHeaderComponent implements OnInit {
  // keywords = ['angular', 'how-to', 'tutorial', 'accessibility'];
  keywords: string[] = [];
  public showMobileMenu$: Observable<boolean> = new Observable<boolean>();
  public screenSize$: Observable<any>;
  constructor(
    private menuService: MenuService,
    public screenSizeService: ScreenSizeService,
    private searchKeywordService: SearchKeywordService
  ) {
    this.showMobileMenu$ = this.menuService.showMobileMenu$;
    this.screenSize$ = this.screenSizeService.screenSize$;
  }
  sSize: string;
  ngOnInit(): void {
    this.screenSize$.pipe(untilDestroyed(this)).subscribe((result) => {
      this.sSize = result;
    });
    //
    this.searchKeywordService.currentSearchKeyword$
      .pipe(untilDestroyed(this))
      .subscribe((result: any[]) => {
        this.keywords = [];
        result.forEach((obj) => {
          this.keywords.push(obj.value);
        });
      });
  }
  onSearchKeyword(data: string): void {
    if( data === '') {
      const value = {key: 'Search', value: data};
      this.searchKeywordService.removeSearchKeyword(value);
      return;
    }
    const value = {key: 'Search', value: data};
    this.searchKeywordService.removeSearchKeyword(value);
    this.searchKeywordService.addSearchKeyword(value);
    // this.favoriteSeason = data;
  }
}
