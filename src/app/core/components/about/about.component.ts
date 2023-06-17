import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule

  ],
  template: `
    <div class="p-10 flex-col items-center justify-center h-auto">
      
      <h1 class="text-xl font-bold"> about offprice.store </h1>
      <div> domain address: <span class="text-blue-600">https://offprice.store</span></div>
      <div> developed by Chris Jung </div>
      <div> email: <span class="text-blue-600">wonsup.jung@gmail.com</span></div>
      <div> phone: <span class="text-blue-600">1-213-548-1859</span></div>
      <div> address: <span class="text-blue-600">1015 Crocker St. #S27 LA CA US</span></div>
      <div class="mt-4">
        <button class="rounded px-2 py-1 bg-green-600"  (click)="onClose()">Close</button>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class AboutComponent {
  constructor(
    public dialogRef: MatDialogRef<AboutComponent>,
  ) { }
  onClose() {
    this.dialogRef.close();
  }

}
