import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFeedbackComponent } from '../user-feedback/user-feedback.component';
import { DialogService } from '@ngneat/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-feedback-button',
  standalone: true,
  imports: [
    CommonModule,
    UserFeedbackComponent,
  ],
  template: `
    <div
      class="fixed-button fixed top-1/2 right-0 z-10 transform -translate-y-1/2"
    >
      <button (click)="onLeaveMessage()"
        id="feedback-button"
        class="bg-blue-500 text-white text-sm w-6 h-20 rounded-l-lg cursor-pointer transition-colors duration-200 ease-in-out flex items-center justify-center hover:bg-blue-700"
      >
        <span class="transform rotate-90">Feedback</span>
      </button>
    </div>

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackButtonComponent implements OnInit{
  isFeedbackStatus = false;
  constructor(
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
  }
  acitveTab = 'tab1';
  setActiveTab(tabId: string) {
    this.acitveTab = tabId;
  }
  isActiveTab(tabId: string) {
    return this.acitveTab === tabId;
  }
  onLeaveMessage(): void {
    const ref = this.dialogService.open(UserFeedbackComponent, {
      width: '350px',
      height: '500px',
      closeButton: true,
    });
    ref.afterClosed$.subscribe((result) => {
      if (result) {
        console.log('result: ', result);
        this.snackBar.open('Message sent successfully', 'Close', {
          duration: 2000,
        });

      }
    });
  }
}
