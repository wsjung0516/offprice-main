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
      <div> domain address: https://offprice.store</div>
      <div> developed by Chris Jung </div>
      <div> email: wonsup.jung@gmail.com</div>
      <div> phone: 1-213-548-1859</div>
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
