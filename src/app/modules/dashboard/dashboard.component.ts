import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryMenuComponent } from '../layout/components/sidebar/category-menu/category-menu.component';
import { SaleListHeaderComponent } from './components/sale-list-header/sale-list-header.component';
import { Category1MenuComponent} from 'src/app/modules/layout/components/sidebar/category1-menu/category1-menu.component';

@Component({
  standalone: true,
  imports: [
  CommonModule,
    RouterModule,
    CategoryMenuComponent,
    Category1MenuComponent,
    SaleListHeaderComponent,
  ],
  selector: 'app-dashboard',
  template: `
    <!-- <div class="py-2 sm:px-8"> -->
    <div class="py-2 px-2">
      <app-category1-menu></app-category1-menu>
      <app-category-menu></app-category-menu>
      <!-- Header -->
      <div class="z-20 w-full px-2">
        <app-sale-list-header></app-sale-list-header>
      </div>
      <!-- end Header -->
    </div>
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
