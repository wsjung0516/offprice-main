import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  selector: 'app-nft-header',
  template: `
    <div class="mb-4">
      <div
        class="space-x-1 text-xs font-medium text-gray-400 dark:text-night-300"
      >
        <mat-chip-grid
          #chipGrid
          aria-label="Enter keywords"
          [formControl]="formControl"
        >
          <mat-chip-row
            *ngFor="let keyword of keywords"
            (removed)="removeKeyword(keyword)"
          >
            {{ keyword }}
            <button matChipRemove aria-label="'remove ' + keyword">
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip-row>
        </mat-chip-grid>
      </div>
    </div>
  `,
})
export class NftHeaderComponent implements OnInit {
  keywords = ['angular', 'how-to', 'tutorial', 'accessibility'];
  formControl = new FormControl(['angular']);
  constructor() {}

  ngOnInit(): void {}

  removeKeyword(keyword: string) {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }
}
