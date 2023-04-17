import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-html-content',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="">
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
