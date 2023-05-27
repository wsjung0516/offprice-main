import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/auth/login/services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginModule } from './login.module';
import { Title } from '@angular/platform-browser';

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
    <div class="flex mx-auto  items-center justify-center min-h-screen">
      <div
        class="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-50 text-gray-800"
      >
        <div class="mb-8 text-center">
          <h1 class="my-3 text-4xl font-bold">Log in</h1>
        </div>
        <form
          novalidate=""
          action=""
          class="space-y-12 ng-untouched ng-pristine ng-valid"
        >
          <div class="space-y-4">
            <div>
              <label for="email" class="block mb-2 text-sm"
                >Email address</label
              >
              <input
                type="email"
                name="email"
                id="email"
                [(ngModel)]="email"
                placeholder="leroy@example.com"
                class="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
              />
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <label for="password" class="text-sm">Password</label>
                <a
                  [routerLink]="['/login/forgot-password']"
                  rel="noopener noreferrer"
                  href="#"
                  class="text-xs hover:underline text-blue-600"
                  >Forgot password?</a
                >
              </div>
              <input
                type="password"
                name="password"
                id="password"
                [(ngModel)]="password"
                placeholder="*****"
                class="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
              />
            </div>
          </div>
          <div class="space-y-2">
            <div>
              <button
                type="button"
                class="w-full px-8 py-3 font-semibold rounded-md bg-blue-600 text-gray-50"
                (click)="login()"
              >
                Log in
              </button>
            </div>
            <p class="px-6 text-sm text-center text-gray-600">
              Don't have an account yet?
              <a
                [routerLink]="['/login/user-register']"
                rel="noopener noreferrer"
                href="#"
                class="hover:underline text-blue-600"
                >Register</a
              >.
            </p>
          </div>
          <div class="border border-blue-400 rounded">
            <a
              (click)="signInWithGoogle()"
              class="flex items-center justify-center cursor-pointer bg-white shadow-md rounded px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <img
                src="assets/icons/icons8-google-48.png"
                alt=""
                height="24px"
                width="24px"
                class="mr-2"
              />
              Log In with Google
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, AfterViewInit {
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private titleService: Title,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.titleService.setTitle('Login');
    const title = this.titleService.getTitle();
    this.cd.detectChanges();
    console.log('title: ', title);
  }

  login() {
    if (this.email == '') {
      alert('Please enter email');
      return;
    }

    if (this.password == '') {
      alert('Please enter password');
      return;
    }

    this.auth.login(this.email, this.password);

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
