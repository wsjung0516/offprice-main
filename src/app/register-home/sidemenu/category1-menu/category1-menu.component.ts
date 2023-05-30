import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Categories1 } from 'src/app/core/constants/data-define';
import { RegisterMenuObservableService } from '../../core/services/register-menu-observable.service';

@Component({
  selector: 'app-category1-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule],
template: `
    <div class="bg-gray-200 px-1 py-1 flex items-center">
      <div class="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div class="inline-flex" [style.margin-left.px]="scrollOffset">
          <ng-container *ngFor="let button of categories">
            <button
              mat-button-toggle
              class="border-2 border-transparent rounded-full mx-1 text-gray-500 hover:text-gray-800 focus:outline-none focus:border-blue-500 active:text-blue-500 button-group"
              [ngClass]="{ selected: selected_category.id === button.id }"
              [value]="button"
              (click)="onSelect(button)"
            >
              <span class="text-sm">{{ button.key }}</span>
            </button>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
      .button-group {
        border: 1px solid #ccc;
        padding: 1px 6px;
        background-color: #fff;
        color: #333;
        font-size: 8px;
      }

      .button-group.selected {
        background-color: green;
        color: #fff;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }

      /* For IE, Edge and Firefox */
      .scrollbar-hide {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
  
  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Category1MenuComponent implements AfterViewInit{
  constructor(
    private registerMenuObservableService: RegisterMenuObservableService,
  ) { }
  categories = Categories1;
  buttonWidth = 40;
  scrollDistance = 200;
  scrollOffset = 0;
  selected_category: any = { id: '1', value: 'All' };
  ngAfterViewInit(): void {
    this.onSelect({id:'1'})
    setTimeout(()=>{
    });
  }
  onSelect(category: any) {
    this.selected_category = category;
    const value = { key: 'category1', value: category.key };
    this.registerMenuObservableService.category1.next(category.id);
  }
}
