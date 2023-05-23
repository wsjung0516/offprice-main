import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { HomeComponent } from './home/home.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
CommonModule,
  HomeComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'angular-app';
  isLoading = false;
  name: string;
  loggedUser: any;
  private logoutTimer: any;
  isRegisterButton = false;
  
  constructor(
  ) {}
  async ngOnInit() {
  }
  // Logout after 30 minutes of inactivity
  ngAfterViewInit() {
  }
 
}
