import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginModule } from './login.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
CommonModule,
    FormsModule,
    RouterModule,
    // LoginModule
  ],
template: `
  <div class="h-screen overflow-hidden flex items-center justify-center ">
    <div class="max-w-2xl">
      <div class="bg-white shadow-md rounded">
        <div class="mb-6">
          <div class="text-center text-2xl text-gray-900">Sell on offPrice</div>
        </div>
        <form>
          <div class="mb-4">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="email" [(ngModel)]="email">
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="password" [(ngModel)]="password">
          </div>
          <div class="flex justify-center mb-4">
            <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" (click)="login()">Login</button>
          </div>
          <div class="flex items-center justify-between mt-4">
            <div class="">
              <a [routerLink]="['/login/user-register']" class="font-bold text-sm text-blue-700 hover:text-blue-800 underline"><span class="">Register</span></a>
            </div> 
            <div class="">
              <a [routerLink]="['/login/forgot-password']" class="font-bold text-sm text-blue-700 hover:text-gray-900">Forgot Password?</a>
            </div>
          </div>
          <div class="mt-4">
            <a (click)="signInWithGoogle()" class="flex items-center justify-center cursor-pointer bg-white shadow-md rounded px-4 py-2 text-gray-700 hover:bg-gray-100">
              <img src="assets/icons/icons8-google-48.png" alt="" height="24px" width="24px" class="mr-2"> Log In with Google
            </a>
          </div>
          <!-- <div class="mt-4 ">
            <a (click)="signInWithFacebook()" class="flex items-center justify-center cursor-pointer bg-red shadow-md rounded px-4 py-2 text-gray-700 hover:bg-gray-100">
              <img src="assets/icons/icons8-facebook-48.png" alt="" height="24px" width="24px" class="mr-2"> Sign In with Facebook
            </a>
          </div> -->
        </form>
      </div>
    </div>
  </div>

  `,
  styles: [`

  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  constructor(private auth : AuthService) { }

  ngOnInit(): void {
  }

  login() {

    if(this.email == '') {
      alert('Please enter email');
      return;
    }

    if(this.password == '') {
      alert('Please enter password');
      return;
    }

    this.auth.login(this.email,this.password);
    
    this.email = '';
    this.password = '';

  }

  async signInWithGoogle() {
    await this.auth.googleSignIn();
  }
  async signInWithFacebook() {
    await this.auth.facebookSignIn();
  }
 
}

