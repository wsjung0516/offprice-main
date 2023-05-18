import {Component} from '@angular/core';
// import {PopoverRef} from "../popover/popover-ref";
import {FilePreviewOverlayRef} from "@main-layout/image-layout/overlay-image/file-preview-overlay-ref";

// import { PopoverRef } from '../../../../dynamic-cdk-popover/src/app/popover/popover-ref';

@Component({
    template: `
        <!--    <div class="" style="height: 400px; width: 400px; background: greenyellow">-->
        <div class="bg-gray-100 relative">
            <div class="w-96 h-96 bg-green-100">
                <div class="w-12 h-12" [hidden]="!imageLoader">
                    <img src="assets/images/ZZ5H.gif" alt=""/>
                </div>
                <div class="h-auto">
                    <img [hidden]="imageLoader" src="{{image}}" (load)="this.imageLoader = false;" alt/>
                </div>
            </div>
            <div class="flex justify-end">
                <div
                    class="h-6 w-6 bg-blue-700 text-white rounded-xl text-xl font-bold cursor-pointer flex justify-center absolute top-0 right-0">
                    <span class="" (click)="close()">X</span>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            /*display: block;*/
            width: 200px;
        }
    `]
})
export class InsidePopoverComponent {
    imageLoader: boolean = true;
    skills;
    image: string | undefined;

    constructor(private popoverRef: FilePreviewOverlayRef) {
        // this.skills = this.popoverRef.data.skills;
        this.image = this.popoverRef.data.image.url
        // setTimeout(()=> this.imageLoader = false, 3000)
    }

    close() {
        this.popoverRef.closeA({id: 1});
    }

}
