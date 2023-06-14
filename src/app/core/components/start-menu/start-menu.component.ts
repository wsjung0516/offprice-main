import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogRef } from '@ngneat/dialog';
import { Title } from '@angular/platform-browser';
interface Data {
  title: string;
}
@Component({
  selector: 'app-start-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ng-container>
      <div
        class="z-100 flex h-48 w-76 bg-white flex-col rounded-md items-center justify-center opacity-1 "
      >
        <div class="flex flex-col items-center justify-center">
          <div class="flex items-center justify-start">
            <div
              class="m-4 p-2 w-64 h-14 border border-green-400 rounded-md bg-green-100  text-black flex items-center justify-start"
            >
              <img
                src="assets/images/online-shopping.png"
                width="36"
                height="36"
                alt=""
              />
              <div class="">
                <button
                  [routerLink]="['/']"
                  type="button"
                  class="ml-4"
                  (click)="onClose('shopping')"
                >
                  <span class="text-2xl">Shopping</span>
                </button>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-start">
            <div
              class="m-4 p-2 w-64 h-14 border border-green-400 rounded-md bg-green-100 text-black flex items-center justify-start"
            >
              <img
                src="assets/images/seller.png"
                width="36"
                height="36"
                alt=""
              />
              <div class="">
                <button
                  [routerLink]="['/register-home']"
                  type="button"
                  class="ml-4"
                  (click)="onClose('register')"
                >
                  <span class="text-2xl">Sell on offPrice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartMenuComponent implements AfterViewInit {
  title = '';
  ref: DialogRef<Data> = inject(DialogRef);
  constructor(private titleService: Title, private cd: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    // this.title = 'user register';
    console.log('start-menu title: ', this.title);
    // this.cd.detectChanges();
  }
  onClose(data: string) {
    if (data === 'shopping') {
      // this.titleService.setTitle('offPrice');
      this.ref.close(true);
    } else if (data === 'register') {
      this.titleService.setTitle('Register');
      this.ref.close(true);
    }
  }
}
