import { Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  standalone: true,
  imports: [
  AngularSvgIconModule
  ],
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.scss'],
})
export class BottomNavbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
