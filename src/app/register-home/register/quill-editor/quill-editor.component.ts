import { Component, EventEmitter, Output, ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quill-editor',
  standalone: true,
  imports: [CommonModule,QuillModule,MatCardModule, FormsModule],
  template: `
    <mat-card>
      <mat-card-content>
        <div class="">
          <p class="mb-2 text-xl font-bold">Insert comment</p>
          <quill-editor [(ngModel)]="htmlText"
            [styles]="{ height: '200px' }"
            [modules]="quillConfig"
            (onEditorCreated)="created($event)"
            (onEditorChanged)="changedEditor($event)"
          >
          </quill-editor>
        </div>
      </mat-card-content>
    </mat-card>
    <!-- <pre><code>{{htmlText}}</code></pre> -->
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
  
})
export class QuillEditorComponent {
  title = 'angular-quill-example-app';
  @Input() set html (val: any) {
    // console.log('val',val)
    this.htmlText = val
  };
  @Output() OnCreatedDescription = new EventEmitter<any>();
  htmlText = '<p>Initial content</p>'

  blured = false
  focused = false
  quillConfig = {}
  constructor() { 
    this.quillConfig = {
      'toolbar': [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                         // remove formatting button

        ['link', 'image', 'video'],                         // link and image, video

      ]
    }
  }
  // ngOnChanges(changes: SimpleChanges) {
  //   console.log('changes',changes)
  // }
  created(event: any) {
    // console.log('event',event)
  }
  changedEditor(event: any) {
    // console.log('changeEditor',event.html)
    this.OnCreatedDescription.emit(event)
  }

}
