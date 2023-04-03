import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuService } from '../../../../core/services/menu.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobilecomponent';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/core/services/screen-size.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router, RouterModule } from '@angular/router';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [
  CommonModule,
    AngularSvgIconModule,
    NavbarMenuComponent,
    NavbarMobileComponent,
    ProfileMenuComponent,
    MatIconModule,
    RouterModule
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  displayMode: string = 'grid | list';
  sSize: string;
  // public screenSize$: Observable<any>;
  constructor(private menuService: MenuService, 
    private screenSizeService: ScreenSizeService,
    private router: Router,
    private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.displayMode = localStorage.getItem('displayMode') || 'grid';
    this.screenSizeService.screenSize$.pipe(untilDestroyed(this)).subscribe((size) => {
      console.log('size', size)
      this.sSize = size;
      this.cd.detectChanges();
    });

  }

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }
  toggleDisplayMode(): void {
    if( this.displayMode === 'grid' ) {
      this.displayMode = 'list';
      this.router.navigate(['dashboard/table_list']);
    } else {
      this.displayMode = 'grid';
      this.router.navigate(['dashboard/sale_list']);
    }
    localStorage.setItem('displayMode', this.displayMode);
  }
}
