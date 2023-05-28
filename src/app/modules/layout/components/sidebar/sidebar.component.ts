import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from 'src/app/core/services/theme.service';
import { MenuService } from '../../../../core/services/menu.service';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SelectSizeComponent } from './select-size/select-size.component';
import { PriceRangeComponent } from './price-range/price-range.component';
import { MaterialComponent } from './material/material.component';
import { MatIconModule } from '@angular/material/icon';
import { SearchPeriodComponent } from './search-period/search-period.component';
//import { AuthService } from ;
import { ColorComponent } from './color/color.component';
import { AuthService } from 'src/app/core/auth/login/services/auth.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    // CategoryComponent,
    SelectSizeComponent,
    PriceRangeComponent,
    MaterialComponent,
    SearchPeriodComponent,
    ColorComponent,
    MatIconModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  public showSideBar$: Observable<boolean> = new Observable<boolean>();
  // public pagesMenu$: Observable<MenuItem[]> = new Observable<MenuItem[]>();
  // public appJson: any = packageJson;

  constructor(
    public themeService: ThemeService,
    private menuService: MenuService,
    private authService: AuthService,
    private sessionStorageService: SessionStorageService,
    private snackBar: MatSnackBar
  ) {
    this.showSideBar$ = this.menuService.showSideBar$;
    // this.pagesMenu$ = this.menuService.pagesMenu$;
  }

  ngOnInit(): void {}

  public toggleSidebar() {
    this.menuService.toggleSidebar();
  }

  toggleTheme() {
    this.themeService.theme = !this.themeService.isDark ? 'dark' : 'light';
  }
  signOut() {
    const isRegisterLoggedIn:any = this.sessionStorageService.getItem('isRegisterLoggedIn');
    if( isRegisterLoggedIn) {
      this.snackBar.open('You can not log out because the Register window is still working.', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.authService.logout();
  }
}
