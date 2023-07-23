import { Component, Input, OnInit, effect } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuService } from '../../../../../core/services/menu.service';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
// import { CategoryComponent } from './../../sidebar/category/category.component';
import { SelectSizeComponent } from '../../sidebar/select-size/select-size.component';
import { SearchPeriodComponent } from '../../sidebar/search-period/search-period.component';
import { PriceRangeComponent } from '../../sidebar/price-range/price-range.component';
import { ColorComponent } from '../../sidebar/color/color.component';
// import { PatternComponent } from '../../sidebar/pattern/pattern.component';
import { MaterialComponent } from '../../sidebar/material/material.component';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
CommonModule,
    AngularSvgIconModule,
    // CategoryComponent,
    SelectSizeComponent,
    SearchPeriodComponent,
    PriceRangeComponent,
    ColorComponent,
    MaterialComponent,
  ],
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.scss'],
})
export class NavbarMobileComponent implements OnInit {
  public showMobileMenu$: Observable<boolean> = new Observable<boolean>();

  constructor(private menuService: MenuService,
    private sharedMenuObservableService: SharedMenuObservableService) {
    this.showMobileMenu$ = this.menuService.showMobileMenu$;
    effect(() => {
      if( this.sharedMenuObservableService.showMobileMenu()){
        this.menuService.showMobileMenu = false;
        this.sharedMenuObservableService.showMobileMenu.set(false);
      }
    }, { allowSignalWrites : true})
  }

  ngOnInit(): void {
    // this.sharedMenuObservableService.showMobileMenu$.pipe(untilDestroyed(this)).subscribe((data) => {
    //   this.menuService.showMobileMenu = false;
    // })
  }

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = false;
  }
}
