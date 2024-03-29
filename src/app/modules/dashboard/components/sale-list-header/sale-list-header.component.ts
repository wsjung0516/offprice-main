import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MenuService } from 'src/app/core/services/menu.service';
import { Observable, Subscription } from 'rxjs';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import { SearchKeywordService } from 'src/app/core/services/search-keyword.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import {
  ChipsKeywordService,
  SearchKeyword,
} from 'src/app/core/services/chips-keyword.service';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RemoveChipsKeywordService } from 'src/app/core/services/remove-chips-keyword.service';
import { InputKeywordComponent } from './../../../layout/components/sidebar/input-keyword/input-keyword.component';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    InputKeywordComponent,
  ],
  selector: 'app-sale-list-header',
  templateUrl: './sale-list-header.component.html',
  styles: [
    `
      .mat-chip-list-wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleListHeaderComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayMode = '';
  // keywords: SearchKeyword[] = [];
  searchItemLength: number = 0;
  private storageItemSubscription: Subscription | undefined;
  public screenSize$: Observable<any>;
  constructor(
    private menuService: MenuService,
    public screenSizeService: ScreenSizeService,
    // private searchKeywordService: SearchKeywordService,
    private localStorageService: LocalStorageService,
    private cd: ChangeDetectorRef,
    private chipsKeywordService: ChipsKeywordService,
    private sharedMenuObservableService: SharedMenuObservableService,
    private router: Router,
    private removeChipsKeywordService: RemoveChipsKeywordService,
    private sessionStorageService: SessionStorageService
  ) {
    this.screenSize$ = this.screenSizeService.screenSize$;
  }
  showMobileMenu = this.menuService.showMobileMenu; // showMobileMenu = signal(false);
  sSize: string;

  ngOnInit(): void {
    this.subscribeToScreenSize();
    this.subscribeToSearchKeywords();
    this.subscribeToLocalStorageItem();
  }
  ngAfterViewInit() {
    this.displayMode = this.sessionStorageService.getItem('displayMode');
    this.cd.detectChanges();
  }
  subscribeToScreenSize(): void {
    this.screenSize$.pipe(untilDestroyed(this)).subscribe((result) => {
      this.sSize = result;
      this.cd.markForCheck();
    });
  }
  keywords = computed(() =>
    this.chipsKeywordService
      .searchKeyword()
      .filter(
        (obj: any) =>
          (obj.value !== '' && obj.key === 'input_keyword') ||
          (obj.value !== 'All' && obj.key !== 'input_keyword')
      )
  );
  subscribeToSearchKeywords(): void {
    /*     this.chipsKeywordService.searchKeyword$
      .pipe(untilDestroyed(this))
      .subscribe((result: any[]) => {
        this.keywords = result.filter(
          (obj) =>
            (obj.value !== '' && obj.key === 'input_keyword') ||
            (obj.value !== 'All' && obj.key !== 'input_keyword')
        );
        this.cd.markForCheck();
      }); */
  }

  subscribeToLocalStorageItem(): void {
    this.storageItemSubscription = this.localStorageService.storageItem$
      .pipe(untilDestroyed(this))
      .subscribe((item) => {
        if (item && item.key === 'searchItemsLength') {
          this.searchItemLength = +item.value;
          this.cd.detectChanges();
        }
      });
  }
  // When the user clicks close button in the chips.
  removeChipsKeyword(keyword: SearchKeyword) {
    this.removeChipsKeywordService.resetSearchKeyword(keyword);
    if (keyword['key'] === 'input_keyword') {
      // To clear the input field.
      // this.inputKeyword = '';
      // this.cd.detectChanges();
    }
  }

  toggleDisplayMode(): void {
    if (this.displayMode === 'grid') {
      this.displayMode = 'list';
      this.router.navigate(['dashboard/table_list']);
    } else {
      this.displayMode = 'grid';
      this.router.navigate(['dashboard/sale_list']);
    }
    this.sessionStorageService.setItem('displayMode', this.displayMode);
    // this.localStorageService.setItem('displayMode', this.displayMode);
    this.sharedMenuObservableService.resetSearchConditions.set(true);
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.storageItemSubscription) {
      this.storageItemSubscription.unsubscribe();
    }
  }
}
