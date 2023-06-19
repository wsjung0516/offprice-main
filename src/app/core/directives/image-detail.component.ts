import {Component, OnInit, ChangeDetectionStrategy, Inject, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
interface Data {
    image: string;
}

@Component({
    selector: 'app-image-detail',
    template: `
        <div class="w-auto h-auto overflow-hidden">
           <img [src]="image" class="min-h-full" alt="offprice.store">
        </div>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageDetailComponent implements AfterViewInit {
    // url = API_GET_IMAGE_300;
    image: string;
    constructor(
        public dialogRef: MatDialogRef<ImageDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public  data: any,
        private _cdr: ChangeDetectorRef
    ) {
    }
    ngAfterViewInit() {
        this.image = this.data;
        this._cdr.detectChanges();
    }
}
