import {Directive, OnInit, ElementRef, HostListener, Input} from '@angular/core';
import {DialogPosition, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DescriptionDetailComponent} from "src/app/core/directives/description-detail.component";

@Directive({
    selector: '[descriptionDetail]',
    standalone: true
})
export class DescriptionDetailDirective {
  @Input() html: string;
  
  dialogRef: MatDialogRef<DescriptionDetailComponent>;

  constructor(
      private elm: ElementRef,
      private _dialogService: MatDialog
  ) {}

  ngOnInit() {}

  @HostListener('mouseenter') mouseover(event: Event) {
      this.openImageDetailDialog();
  }

  @HostListener('mouseleave') mouseleave(event: Event) {
      if (!this.dialogRef) return; // hskim 2021.03.29 added to prevent undefined error
      this.dialogRef.close();
  }

  openImageDetailDialog() {
      const rect = this.elm.nativeElement.getBoundingClientRect();
      const position: DialogPosition = {
          // left: Math.round(rect.left - 140) + 'px',
          top: Math.round(rect.top + 50 ) + 'px'
      };

      if (!this.html) return; // 
      this.dialogRef = this._dialogService.open(DescriptionDetailComponent, {
          data: this.html,
          width: '300px',
          height: '400px',
          // position: position,
          hasBackdrop: false,
          panelClass: 'app-full-bleed-dialog',
          
          // panelClass: 'control-box-custom-dialog',
      });

  }
}
