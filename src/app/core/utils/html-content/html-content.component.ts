import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-html-content',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="m-4 w-12 h-12 bg-green-400">
    <div [innerHTML]="content"></div>

  </div>
  `,
  styles: [
  ],
  encapsulation: ViewEncapsulation.ShadowDom,

})
export class HtmlContentComponent {
  @Input() content: string;
}
