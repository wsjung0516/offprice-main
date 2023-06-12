import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
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
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { set } from 'date-fns';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
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
export class SidebarComponent implements OnInit, AfterViewInit {
  public showSideBar$: Observable<boolean> = new Observable<boolean>();
  // public pagesMenu$: Observable<MenuItem[]> = new Observable<MenuItem[]>();
  // public appJson: any = packageJson;
  @ViewChildren('details') detailsElements: QueryList<ElementRef>;
  sideBarStatus = false;
  constructor(
    public themeService: ThemeService,
    private menuService: MenuService,
    private authService: AuthService,
    private sessionStorageService: SessionStorageService,
    private snackBar: MatSnackBar,
    private sharedMenuObservableService: SharedMenuObservableService,
    private cd: ChangeDetectorRef
  ) {
    this.showSideBar$ = this.menuService.showSideBar$;
    this.sharedMenuObservableService.showSideBar$ = this.showSideBar$;
    // this.pagesMenu$ = this.menuService.pagesMenu$;
  }

  ngOnInit(): void {
    this.showSideBar$.subscribe((res) => {
      this.sideBarStatus = res;
    });
    
  }
  ngAfterViewInit() {
    this.sharedMenuObservableService.closeSideBar$
    .pipe(untilDestroyed(this)).subscribe((res) => {  
      // console.log('res', res, this.sideBarStatus);
      if( this.sideBarStatus) {
        setTimeout(() => {
          this.toggleSidebar();
          this.cd.detectChanges();
        }, 500);
  
      }
    });

  }
  public toggleSidebar() {
    this.menuService.toggleSidebar();
    this.closeAllMenu();
  }

  toggleTheme() {
    this.themeService.theme = !this.themeService.isDark ? 'dark' : 'light';
  }
  signOut() {
    this.authService.logout();
  }
  onToggleMenu(clickedDetails: HTMLDetailsElement) {
    if( clickedDetails.open) {
    } else {
      this.detailsElements.forEach((detailsElement) => {
          const details = detailsElement.nativeElement;
          // Without detail reason, the first button work abnormally, so I added this condition 
          if( details === clickedDetails && details.open) {
             details.open = false;
          }
          if (details !== clickedDetails && details.open) {
              details.open = false;
          }

        });
      }
    if (!this.sideBarStatus) {
      this.toggleSidebar();
      //this.menuService.showSideBar = false;
    } else {
      //this.menuService.showSideBar = true;
    }    // 클릭된 details의 상태를 토글한다
    // clickedDetails.open = !clickedDetails.open;
  }
  closeAllMenu() {
    this.detailsElements.forEach((detailsElement) => {
      const details = detailsElement.nativeElement;
      details.open = false;
    });
  }
  onHelp() {
    console.log('onHelp')
    window.open('/help', '_blank')
  }

  // onToggleMenu(clickedDetails: HTMLElement) {
  //   this.detailsElements.forEach((detailsElement) => {
  //     const details = detailsElement.nativeElement;
  //     console.log('details', details,clickedDetails);
  //     if( details === clickedDetails && details.open) {
  //       details.open = false;
  //     }
  //     if (details !== clickedDetails && details.open) {
  //       details.open = false;
  //     }
  //   });
  // }
}
