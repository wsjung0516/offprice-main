import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="h-screen flex items-center justify-center bg-gray-100">
      <div class="max-w-md">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-8">
            <h1 class="m-3 text-3xl font-bold">Register user</h1>
          </div>
          <form>
            <div class="mb-4">
              <label
                for="email"
                class="block text-gray-700 text-sm font-bold mb-2"
                >Email</label
              >
              <input
                type="email"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="email"
                [(ngModel)]="email"
              />
            </div>
            <div class="mb-4">
              <label
                for="password"
                class="block text-gray-700 text-sm font-bold mb-2"
                >Password</label
              >
              <input
                type="password"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="password"
                [(ngModel)]="password"
              />
            </div>
            <button
              type="button"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              (click)="register()"
            >
              Register
            </button>
            <div class="flex items-center justify-between mt-4">
              <a
                [routerLink]="['/login']"
                class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                >Have an account? <span class="text-red-500">Login</span></a
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRegisterComponent implements OnInit {
  email = '';
  password = '';

  constructor(private auth: AuthService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Register');
    // console.log('UserRegisterComponent ngOnInit')
  }

  register() {
    if (this.email == '') {
      alert('Please enter email');
      return;
    }

    if (this.password == '') {
      alert('Please enter password');
      return;
    }

    this.auth.register(this.email, this.password);

    this.email = '';
    this.password = '';
  }
}
