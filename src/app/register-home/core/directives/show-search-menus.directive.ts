import {
  Directive,
  OnInit,
  ElementRef,
  HostListener,
  Input,
  ViewContainerRef,
} from '@angular/core';
import {
  DialogPosition,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ShowSearchMenusComponent } from './show-search-menus.component';
import { SelectSizeComponent } from '../../sidemenu/select-size/select-size.component';
import { PriceRangeComponent } from '../../sidemenu/price-range/price-range.component';
import { MaterialComponent } from '../../sidemenu/material/material.component';
import { SearchPeriodComponent } from '../../sidemenu/search-period/search-period.component';
import { ColorComponent } from '../../sidemenu/color/color.component';
import { ComponentType } from '@angular/cdk/portal';
// import {ImageZoomComponent} from "@main-layout/image-layout/image-zoom/image-zoom.component";
// import {DialogRef, DialogService} from "@ngneat/dialog";
@Directive({
  selector: '[appShowSearchMenus]',
  standalone: true,
})
export class ShowSearchMenusDirective implements OnInit {
  @Input() search_menu: string;

  dialogRef: MatDialogRef<ShowSearchMenusComponent>;

  constructor(private elm: ElementRef,
     private _dialogService: MatDialog,
     private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
  }

  @HostListener('mouseenter') mouseover(event: Event) {
    this.openImageDetailDialog();
  }

  // @HostListener('mouseleave') mouseleave(event: Event) {
  //   if (!this.dialogRef) return; //
  //   this.dialogRef.close();
  // }

  openImageDetailDialog() {
    // console.log('ShowSearchMenusDirective openImageDetailDialog', this.search_menu);
    const rect = this.elm.nativeElement.getBoundingClientRect();
    const position: DialogPosition = {
      left: Math.round(rect.left - 10) + 'px',
      top: Math.round(rect.top + 50) + 'px',
    };
    const componentType1 = this.getComponentType(this.search_menu);
    // const componentType2 = this.viewContainerRef.createComponent(componentType1);
    // if (!this.image) return; //
    this.dialogRef = this._dialogService.open(componentType1, {
      data: '',
      width: '300px',
      height: '400px',
      position: position,
      hasBackdrop: true,
      panelClass: 'app-full-bleed-dialog',

      // panelClass: 'control-box-custom-dialog',
    });
        // 사용자가 다이얼로그 외부를 클릭하면 다이얼로그를 닫습니다.
        this.dialogRef.backdropClick().subscribe(() => {
          this.dialogRef.close();
      });
  
      // 다이얼로그가 닫혔을 때 dialogRef를 초기화합니다.
      this.dialogRef.afterClosed().subscribe(() => {
          this.dialogRef = null;
      });
  }
  getComponentType(search_menu: string): ComponentType<any> {
    if (search_menu === 'price') {
      return PriceRangeComponent
    } else if (search_menu === 'size') {
      return SelectSizeComponent
    } else if (search_menu === 'material') {
      return MaterialComponent
    } else if (search_menu === 'search_period') {
      return SearchPeriodComponent
    } else if (search_menu === 'color') {
      return ColorComponent
    } else if (search_menu === 'size') {
      return SelectSizeComponent
    }
    return PriceRangeComponent
  }
}
