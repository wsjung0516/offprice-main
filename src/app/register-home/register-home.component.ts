import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedMenuObservableService } from '../core/services/shared-menu-observable.service';
import { set } from 'date-fns';
import { SharedParentObservableService } from '../core/services/shared-parent-observable.service';

@Component({
  selector: 'app-register-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: ` <router-outlet></router-outlet> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterHomeComponent implements OnInit, AfterViewInit {
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private sharedParentObservableService: SharedParentObservableService
  ) {}

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      // To prevent from showing register button in child page
      this.sharedMenuObservableService.closeRegisterButton.next(false);
      // To prevent from showing profile button in child page
      this.sharedParentObservableService.isProfileMenuOpen.next(false);
    },500);
  }
}
