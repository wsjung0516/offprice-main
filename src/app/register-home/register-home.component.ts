import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { RegisterMenuObservableService } from '../core/services/register-menu-observable.service';
import { set } from 'date-fns';
// import { SharedParentObservableService } from '../core/services/shared-parent-observable.service';
import { Title } from '@angular/platform-browser';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';

@Component({
  selector: 'app-register-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: ` <router-outlet></router-outlet> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Register';
  constructor(
    // private registerMenuObservableService: RegisterMenuObservableService,
    // private sharedParentObservableService: SharedParentObservableService,
    private titleService: Title,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    console.log('RegisterHomeComponent ngOnInit');
  }
  ngAfterViewInit(): void {
    this.titleService.setTitle(this.title);
  }
  ngOnDestroy(): void {
    this.sessionStorageService.removeItem('isRegisterLoggedIn');
  }
}
