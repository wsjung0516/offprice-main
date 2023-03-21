import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuService } from 'src/app/core/services/menu.service';
import { MenuItem, SubMenuItem } from 'src/app/core/models/menu.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NavbarMobileSubmenuComponent } from './../navbar-mobile-submenu/navbar-mobile-submenu.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AngularSvgIconModule,
    NavbarMobileSubmenuComponent,
  ],

  selector: 'app-navbar-mobile-menu',
  templateUrl: './navbar-mobile-menu.component.html',
  styleUrls: ['./navbar-mobile-menu.component.scss'],
})
export class NavbarMobileMenuComponent implements OnInit {
  public pagesMenu$: Observable<MenuItem[]> = new Observable<MenuItem[]>();
  public showSideBar$: Observable<boolean> = new Observable<boolean>();

  constructor(private menuService: MenuService) {
    this.showSideBar$ = this.menuService.showSideBar$;
    this.pagesMenu$ = this.menuService.pagesMenu$;
  }

  public toggleMenu(subMenu: SubMenuItem) {
    this.menuService.toggleMenu(subMenu);
  }

  public closeMenu() {
    this.menuService.showMobileMenu = false;
  }

  ngOnInit(): void {}
}
