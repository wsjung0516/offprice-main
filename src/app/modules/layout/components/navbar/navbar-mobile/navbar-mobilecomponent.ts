import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuService } from '../../../services/menu.service';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  standalone: true,
  imports: [
CommonModule,
  AngularSvgIconModule
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
