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
import { AboutComponent } from 'src/app/core/components/about/about.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TippyDirective } from '@ngneat/helipopper';
import { toObservable } from '@angular/core/rxjs-interop';
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
    MatDialogModule,
    TippyDirective
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChildren('details') detailsElements: QueryList<ElementRef>;
  // sideBarStatus = false;
  showSideBar = this.menuService.showSideBar;
  constructor(
    public themeService: ThemeService,
    private menuService: MenuService,
    private authService: AuthService,
    private sessionStorageService: SessionStorageService,
    private snackBar: MatSnackBar,
    private sharedMenuObservableService: SharedMenuObservableService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog 
  ) {
    toObservable(this.closeSideBar)
    .pipe(untilDestroyed(this)).subscribe((res) => {  
      // console.log('res', res, this.sideBarStatus);
      // if( this.sideBarStatus) {
      if( this.showSideBar()) {
        setTimeout(() => {
          this.toggleSidebar();
          this.cd.detectChanges();
        }, 500);
  
      }
    });

  }

  ngOnInit(): void {
  }
  closeSideBar = this.sharedMenuObservableService.closeSideBar;
  ngAfterViewInit() {

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
    if (!this.showSideBar()) {
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
  openAbout() {
    // this.router.navigate(['/about']);
    this.dialog.open(AboutComponent,{
    });
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
