import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuService } from '../../../../../core/services/menu.service';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CategoryComponent } from './../../sidebar/category/category.component';
import { SelectSizeComponent } from '../../sidebar/select-size/select-size.component';
import { SearchPeriodComponent } from '../../sidebar/search-period/search-period.component';
import { PriceRangeComponent } from '../../sidebar/price-range/price-range.component';
import { PatternComponent } from '../../sidebar/pattern/pattern.component';
import { MaterialComponent } from '../../sidebar/material/material.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    CategoryComponent,
    SelectSizeComponent,
    SearchPeriodComponent,
    PriceRangeComponent,
    PatternComponent,
    MaterialComponent,
  ],
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.scss'],
})
export class NavbarMobileComponent implements OnInit {
  public showMobileMenu$: Observable<boolean> = new Observable<boolean>();

  constructor(private menuService: MenuService) {
    this.showMobileMenu$ = this.menuService.showMobileMenu$;
  }

  ngOnInit(): void {}

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = false;
  }
}
