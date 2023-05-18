import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule,
MatIconModule],
  template: `

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpComponent {}
