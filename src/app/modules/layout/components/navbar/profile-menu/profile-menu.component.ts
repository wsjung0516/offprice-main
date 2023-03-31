import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
  ],
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styles: [`
    .z_index{
      z-index:100;
    }    
  `],
})
export class ProfileMenuComponent implements OnInit {
  public isMenuOpen = false;

  constructor() {}

  ngOnInit(): void {}

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
