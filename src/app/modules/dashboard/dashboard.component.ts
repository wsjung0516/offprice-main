import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryMenuComponent } from './../layout/components/sidebar/category-menu/category-menu.component';
import { SaleListHeaderComponent } from './components/sale-list-header/sale-list-header.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CategoryMenuComponent,
    SaleListHeaderComponent,
  ],
  selector: 'app-dashboard',
  template: `
    <div class="mx-auto px-4 py-2 sm:px-8">
      <app-category-menu></app-category-menu>
      <!-- Header -->
      <div class="fixed z-20 w-full">
        <app-sale-list-header></app-sale-list-header>
      </div>
      <!-- end Header -->
    </div>
    <router-outlet></router-outlet>
  `,
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
