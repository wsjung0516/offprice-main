import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="h-screen flex items-center justify-center bg-gray-100">
  <div class="max-w-md">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <h4 class="text-red-600 text-gray-700">Welcome</h4>
      </div>
      <div class="mb-4">
        <p class="text-gray-600">Link has sent on your registered email. Please verify it.</p>
      </div>
    </div>
  </div>
</div>

  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyEmailComponent {

}
