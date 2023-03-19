import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@ngneat/dialog';
interface Data {
  title: string;
  message: string;
 }

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
<!-- Modal -->
<div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
  <div class="relative w-auto my-1 mx-auto max-w-sm">
    <!--content-->
    <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
      <!--header-->
      <div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
        <h3 class="text-3xl font-semibold">
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
        <p class="my-2 text-blueGray-500 text-lg leading-relaxed">{{message}}
        </p>
      </div>
      <!--footer-->
      <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
        <button class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" (click)="ref.close()">
          Close
        </button>
        <button class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" (click)="onOk()">
          OK
        </button>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [
  ]
})
export class ConfirmDialogComponent {
  ref: DialogRef<Data> = inject(DialogRef);
  message: string = this.ref.data.message;
  title: string = this.ref.data.title;
  onOk() {
    this.ref.close(true);
  }

}
