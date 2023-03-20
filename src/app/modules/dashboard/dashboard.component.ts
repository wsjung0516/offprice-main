import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  selector: 'app-dashboard',
  template: `<router-outlet></router-outlet>`,
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
