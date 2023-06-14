import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { set } from 'date-fns';
// import { SharedParentObservableService } from '../core/services/shared-parent-observable.service';
import { Meta, Title } from '@angular/platform-browser';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { CheckIfSellerSetService } from '../core/services/check-if-seller-is-set.service';
import { RegisterAuthService } from './auth/login/services/register-auth.service';

@Component({
  selector: 'app-register-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
template: `
    <div class="">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Register';
  constructor(
    // private sharedMenuObservableService: SharedMenuObservableService,
    // private sharedParentObservableService: SharedParentObservableService,
    private titleService: Title,
    private metaTagService: Meta,
    private sessionStorageService: SessionStorageService,
    private checkIfSellerSetService: CheckIfSellerSetService,
    private authService: RegisterAuthService,
    // private router: Router,
  ) {}

  ngOnInit(): void {
    this.metaTagService.updateTag({
      name: 'description',
      content: 'off price clothes, sell on offPrice, https://offprice.store',
    });
    this.titleService.setTitle('Sell on offprice.store');
    console.log('RegisterHomeComponent ngOnInit');
  }
  ngAfterViewInit(): void {
    this.titleService.setTitle(this.title);
    setTimeout(() => {
      const userId:any = this.sessionStorageService.getItem('userId');
      const ret = this.checkIfSellerSetService.isChecked(userId.user_id).subscribe((ret: any) => {
        if( ret  === false ) {
          this.authService.logout();
          // this.router.navigate(['/register-home']);
        }
      });
    },100);
  }
  ngOnDestroy(): void {
  }
}
