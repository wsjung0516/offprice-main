import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
template: `
      <div class="flex mx-auto  items-center justify-center min-h-screen">
      <div
        class="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-50 text-gray-800"
      >
        <div class="mb-8 text-center">
          <h1 class="m-3 text-2xl font-bold">Forgot password</h1>
        </div>
        <form action="" class="space-y-12 ng-untouched ng-pristine ng-valid">
          <div class="space-y-4">
            <div>
              <label for="email" class="block mb-2 text-sm"
                >Email address</label
              >
              <input
                autocomplete="off"
                type="email"
                name="email"
                id="email"
                [(ngModel)]="email"
                placeholder="leroy@example.com"
                class="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
              />
            </div>

          </div>
          <div class="space-y-2">
            <div>
              <button
                type="button"
                class="w-full px-8 py-3 rounded-md bg-blue-600 text-gray-50"
                (click)="forgotPassword()"
              >
                Send link to your email
              </button>
              <div class="flex items-center justify-between mt-4">
                <a
                  [routerLink]="['/login']"
                  class="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800"
                  >Back to <span class="text-red-500">Login</span></a
                >
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  email = '';

  constructor(private auth: AuthService, private titleService: Title,
    private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    this.titleService.setTitle('forgot password');
    this.sessionStorageService.setItem('title', 'Forgot password');

  }

  forgotPassword() {
    this.auth.forgotPassword(this.email);
    this.email = '';
  }
}
