import {Directive, OnInit, ElementRef, HostListener, Input} from '@angular/core';
import {DialogPosition, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ImageDetailComponent} from "src/app/core/directives/image-detail.component";
// import {ImageZoomComponent} from "@main-layout/image-layout/image-zoom/image-zoom.component";
// import {DialogRef, DialogService} from "@ngneat/dialog";
@Directive({
    selector: '[imageDetail]'
})
export class ImageDetailDirective implements OnInit {
    @Input() image: string;

    dialogRef: MatDialogRef<ImageDetailComponent>;

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

        if (!this.image) return; // 
        this.dialogRef = this._dialogService.open(ImageDetailComponent, {
            data: this.image,
            // width: '400px',
            // height: '600px',
            // position: position,
            hasBackdrop: false,
            panelClass: 'app-full-bleed-dialog',
            
            // panelClass: 'control-box-custom-dialog',
        });

    }
}
