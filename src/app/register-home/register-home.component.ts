import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
    private titleService: Title,
    private metaTagService: Meta,
    private sessionStorageService: SessionStorageService,
    private checkIfSellerSetService: CheckIfSellerSetService,
    private authService: RegisterAuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Explore our closeout section for unbeatable prices on clearance items.',
    });
    this.titleService.setTitle('off price wholesale marketplace');
    // console.log('RegisterHomeComponent ngOnInit');
  }
  ngAfterViewInit(): void {
    this.titleService.setTitle('off price wholesale marketplace');
    this.sessionStorageService.setItem('title','Register');

    setTimeout(() => {
      const userId:any = this.sessionStorageService.getItem('userId');
      const ret = this.checkIfSellerSetService.isChecked(userId.user_id).subscribe((ret: any) => {
        if( ret  === false ) {
          this.authService.logout();
          // this.router.navigate(['/']);
        }
      });
    },100);
  }
  ngOnDestroy(): void {
  }
}
