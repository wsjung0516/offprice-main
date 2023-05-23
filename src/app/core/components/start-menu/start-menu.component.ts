import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogRef } from '@ngneat/dialog';
interface Data {
  title: string
 }
@Component({
  selector: 'app-start-menu',
  standalone: true,
  imports: [CommonModule,
  RouterModule,
],
  template: `
    <div class="flex h-48 w-76 bg-white flex-col rounded-md items-center justify-center opacity-1 ">
      <div class="flex flex-col items-center justify-center">
        <div class="flex items-center justify-start">
          <div class="m-4 p-2 w-64 h-14 border border-green-500 rounded-md bg-green-200  text-black flex items-center justify-start">
            <img src="assets/images/online-shopping.png" width="36" height="36" alt="">
            <div class="">
              <button [routerLink]="['/']" type="button" class="ml-4" (click)="ref.close(true)">
                <span class="text-2xl">Shopping</span>
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-start">
          <div class="m-4 p-2 w-64 h-14 border border-green-500 rounded-md bg-green-200 text-black flex items-center justify-start" >
            <img src="assets/images/seller.png" width="36" height="36" alt="">
            <div class="">
              <button [routerLink]="['/register-home']" type="button" class="ml-4" (click)="ref.close(true)">
                <span class="text-2xl">Sell on offPrice</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartMenuComponent {
  ref: DialogRef<Data> = inject(DialogRef);

}
