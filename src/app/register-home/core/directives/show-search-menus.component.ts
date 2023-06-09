
import {Component, OnInit, ChangeDetectionStrategy, Inject, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
interface Data {
    image: string;
}

@Component({
    selector: 'app-show-search-menus',
    template: `
        <div class="w-96 h-144 overflow-hidden">
            <div class="bg-green-300">
                <p>New Dialog</p>

            </div>
           <!-- <img [src]="image" class="min-h-full" alt="offprice.store"> -->
        </div>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowSearchMenusComponent implements AfterViewInit {
    // url = API_GET_IMAGE_300;
    image: string;
    constructor(
        public dialogRef: MatDialogRef<ShowSearchMenusComponent>,
        @Inject(MAT_DIALOG_DATA) public  data: any,
        private _cdr: ChangeDetectorRef
    ) {
    }
    ngAfterViewInit() {
        this.image = this.data;
        this._cdr.detectChanges();
    }
}
