import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFeedbackComponent } from '../user-feedback/user-feedback.component';
@Component({
  selector: 'app-feedback-button',
  standalone: true,
  imports: [
    CommonModule,
    UserFeedbackComponent,
  ],
  template: `
  <ng-container>
    <div
      class="fixed-button fixed top-1/2 right-0 z-10 transform -translate-y-1/2"
    >
      <button
        id="feedback-button"
        class="bg-blue-500 text-white text-sm w-6 h-20 rounded-l-lg cursor-pointer transition-colors duration-200 ease-in-out flex items-center justify-center hover:bg-blue-700"
      >
        <span class="transform rotate-90">Feedback</span>
      </button>
    </div>

    <div
      id="dialog-overlay"
      class="dialog-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10 hidden justify-center items-center"
    >
      <div class="bg-white shadow-md rounded-lg p-6 relative">
        <div class="flex border-b border-gray-300 mb-4">
          <button
            type="button"
            (click)="setActiveTab('tab1')"
            [ngClass]="{ 'bg-blue-500 text-white': isActiveTab('tab1') }"
            class="px-4 py-2 font-bold text-sm text-white cursor-pointer rounded-t-lg hover:text-blue-700"
          >
            Leave Message
          </button>
          <!-- <button
        type="button"
        (click)="setActiveTab('tab2')"
        [ngClass]="{ 'bg-blue-500 text-white': isActiveTab('tab2') }"
        class="px-4 py-2 font-bold text-sm text-blue-500 cursor-pointer rounded-t-lg hover:text-blue-700"
      >
        Tab 2
      </button>
      <button
        type="button"
        (click)="setActiveTab('tab3')"
        [ngClass]="{ 'bg-blue-500 text-white': isActiveTab('tab3') }"
        class="px-4 py-2 font-bold text-sm text-blue-500 cursor-pointer rounded-t-lg hover:text-blue-700"
      >
        Tab 3
      </button> -->
        </div>
        <button
          type="button"
          id="close-btn"
          class="close-btn absolute top-2 right-2 bg-transparent border-none text-xl cursor-pointer text-gray-700"
        >
          &times;
        </button>
        <div class="tab-content">
          <div *ngIf="isActiveTab('tab1')" class="tab-pane">
            <app-user-feedback></app-user-feedback>
          </div>
          <div *ngIf="isActiveTab('tab2')" class="tab-pane">
            <p>Tab 2 content goes here...</p>
          </div>
          <div *ngIf="isActiveTab('tab3')" class="tab-pane">
            <p>Tab 3 content goes here...</p>
          </div>
        </div>
      </div>
    </div>
  </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackButtonComponent implements OnInit{
  isFeedbackStatus = false;
  constructor(
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
}