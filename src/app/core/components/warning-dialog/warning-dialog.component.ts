import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { DialogRef } from '@ngneat/dialog';

@Component({
  selector: 'app-warnning-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
<!-- Modal -->
<div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
    <div class="relative w-auto my-1 mx-auto max-w-sm">
      <!--content-->
      <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <!--header-->
        <div class="flex items-start justify-between p-4 border-b border-solid border-blueGray-200 rounded-t">
          <h3 class="text-2xl text-red-600 font-semibold">
            {{title}}
          </h3>
          <button class="" (click)="ref.close()">
            <span class="bg-transparent text-black opacity-100 h-6 w-6 text-2xl block z-61" >
              ×
            </span>
          </button>
        </div>
        <!--body-->
        <div class="relative p-3 flex-auto">
          <div class="my-2 text-blueGray-500 text-sm leading-relaxed">
            <div [innerHTML]="message"></div>
          </div>
        </div>
        <!--footer-->
        <div class="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b">
          <!-- <button class="text-blue-600 border border-blue-600 rounded-sm uppercase px-2 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" (click)="ref.close()">
            Close
          </button> -->
          <button class="bg-blue-600 text-white uppercase text-sm px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" (click)="onOk()">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarningDialogComponent  {
  message: SafeHtml = this.ref.data.message;
  title: string = this.ref.data.title;
  constructor(public ref: DialogRef,
    private cd: ChangeDetectorRef) { }
  onOk() {
    this.ref.close(true);
  }
  ngAfterViewInit() {
    // this.message = this.sanitizer.bypassSecurityTrustHtml(this.ref.data.message);
    this.cd.detectChanges();
    
  }
}
