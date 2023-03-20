import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MenuService } from 'src/app/modules/layout/services/menu.service';
import { Observable } from 'rxjs';
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
  selector: 'app-nft-header',
  template: `
    <ng-container *ngIf="currentScreenSize !== 'XSmall'">
      <div class="">
        <div class="flex items-center sm:justify-start">
          <div class="w-80">
          <div class="relative">
            <div
              class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
            ></div>
            <input
              type="search"
              id="default-search"
              class="block p-4 w-full  text-gray-900 bg-gray-50 rounded-lg border border-gray-500 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              required
            />
            <button
              type="submit"
              class="text-white absolute right-1 bottom-1.5 bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <mat-icon>search</mat-icon>
            </button>
          </div>

          </div>

          <div class="mt-2 ml-5 mb-4">
            <div
              class="space-x-1 text-xs font-medium text-gray-400 dark:text-night-300"
            >
              <!-- chips -->
              <mat-chip-set>
                <mat-chip
                  *ngFor="let keyword of keywords"
                  (removed)="removeKeyword(keyword)"
                >
                  {{ keyword }}
                  <button matChipRemove aria-label="'remove ' + keyword">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip>
              </mat-chip-set>
              <!-- chips -->
            </div>
          </div>
        </div>
      </div>
    </ng-container>
    <ng-container *ngIf="currentScreenSize === 'XSmall' ">
      <div *ngIf="!(showMobileMenu$ | async)" class="w-4/5">
        <div class="relative">
          <div
            class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
          ></div>
          <input
            type="search"
            id="default-search"
            class="block p-4 w-full  text-gray-900 bg-gray-50 rounded-lg border border-gray-500 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            required
          />
          <button
            type="submit"
            class="text-white absolute right-1 bottom-1.5 bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <mat-icon>search</mat-icon>
          </button>
        </div>
      </div>
      <div class="ml-5 mb-4">
        <div
          class="mt-2 space-x-1 text-xs font-medium text-gray-400 dark:text-night-300"
        >
          <!-- chips -->
          <mat-chip-set>
            <mat-chip
              *ngFor="let keyword of keywords"
              (removed)="removeKeyword(keyword)"
            >
              {{ keyword }}
              <button matChipRemove aria-label="'remove ' + keyword">
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip>
          </mat-chip-set>
          <!-- chips -->
        </div>
      </div>
    </ng-container>
  `,
})
export class NftHeaderComponent implements OnInit {
  keywords = ['angular', 'how-to', 'tutorial', 'accessibility'];
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  currentScreenSize: string;
  public showMobileMenu$: Observable<boolean> = new Observable<boolean>();
  constructor(private menuService: MenuService, private breakpointObserver: BreakpointObserver) {
      this.showMobileMenu$ = this.menuService.showMobileMenu$;    
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize =
              this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }

  removeKeyword(keyword: string) {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }
}
