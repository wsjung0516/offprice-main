import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { BottomNavbarComponent } from './components/bottom-navbar/bottom-navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarMenuComponent } from './components/navbar/navbar-menu/navbar-menu.component';
import { NavbarMobileMenuComponent } from './components/navbar/navbar-mobile/navbar-mobile-menu/navbar-mobile-menu.component';
import { NavbarMobileSubmenuComponent } from './components/navbar/navbar-mobile/navbar-mobile-submenu/navbar-mobile-submenu.component';
import { NavbarMobileComponent } from './components/navbar/navbar-mobile/navbar-mobilecomponent';
import { NavbarSubmenuComponent } from './components/navbar/navbar-submenu/navbar-submenu.component';
import { NavbarComponent } from './components/navbar/navbar.component';
// import { ProfileMenuComponent } from './components/navbar/profile-menu/profile-menu.component';
import { SidebarMenuComponent } from './components/sidebar/sidebar-menu/sidebar-menu.component';
import { SidebarSubmenuComponent } from './components/sidebar/sidebar-submenu/sidebar-submenu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    RouterModule
  ],
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
