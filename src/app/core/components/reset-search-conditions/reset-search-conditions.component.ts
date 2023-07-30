import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMenuObservableService } from '../../services/shared-menu-observable.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-search-conditions',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      class="ml-4 h-7 w-7 bg-white flex items-center justify-center border border-blue-600 rounded-md "
    >
      <button (click)="onResetConditions()">
        <mat-icon class="text-blue-600 mt-2">refresh</mat-icon>
      </button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetSearchConditionsComponent {
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService
  ) {}
  onResetConditions() {
    this.sharedMenuObservableService.resetSearchConditions.set(true);
  }
}
