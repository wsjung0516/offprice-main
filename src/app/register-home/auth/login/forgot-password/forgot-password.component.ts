import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  template: `
  <div class="h-screen flex items-center justify-center bg-gray-100">
  <div class="max-w-md">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-8">
        <h1 class="m-3 text-3xl font-bold">Forgot password</h1>
      </div>
      <form>
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" [(ngModel)]="email">
        </div>
        <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" (click)="forgotPassword()">Send Link</button>
        <div class="flex items-center justify-between mt-4">
          <a [routerLink]="['/register-home/login']" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Back to <span class="text-red-500">Login</span></a>
        </div>
      </form>
    </div>
  </div>
</div>


  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent implements OnInit {

  email = '';

  constructor(private auth : AuthService) { }

  ngOnInit(): void {
  }

  forgotPassword() {
    this.auth.forgotPassword(this.email);
    this.email = '';
  }
}
