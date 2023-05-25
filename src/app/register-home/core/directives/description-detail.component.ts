import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HtmlContentComponent } from '../utils/html-content/html-content.component';

@Component({
  selector: 'app-description-detail',
  standalone: true,
  imports: [HtmlContentComponent],
  template: `
    <div class=" rounded m-4 ">
      <app-html-content [content]="html"></app-html-content>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionDetailComponent {
  html: string;
  constructor(
    public dialogRef: MatDialogRef<DescriptionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _cdr: ChangeDetectorRef
  ) // private sanitizer: DomSanitizer

  {}
  ngAfterViewInit() {
    this.html = this.data;
    this._cdr.detectChanges();
  }
  //get trustHtml(): SafeHtml {
  // return this.sanitizer(SecurityContext.HTML,this.html);
  //  const ret = this.sanitizer.bypassSecurityTrustHtml('<h1>DomSanitizer</h1>');
  //  console.log('ret',ret, this.html);
  //  return ret;
  //}
}
