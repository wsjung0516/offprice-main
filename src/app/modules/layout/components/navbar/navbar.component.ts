import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuService } from '../../../../core/services/menu.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobilecomponent';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [
CommonModule,
    AngularSvgIconModule,
    NavbarMenuComponent,
    NavbarMobileComponent,
    ProfileMenuComponent,
    MatIconModule
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  constructor(private menuService: MenuService) {}
  displayMode: string = 'grid | list';

  ngOnInit(): void {
    this.displayMode = localStorage.getItem('displayMode') || 'grid';
  }

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }
  toggleDisplayMode(): void {
    this.displayMode = this.displayMode === 'grid' ? 'list' : 'grid';
    localStorage.setItem('displayMode', this.displayMode);
  }
}
