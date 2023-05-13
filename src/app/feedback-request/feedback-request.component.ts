import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedMenuObservableService } from '../core/services/shared-menu-observable.service';
import { SessionStorageService } from './../core/services/session-storage.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

declare let Email: any; 
@Component({
  selector: 'app-feedback-request',
  standalone: true,
  imports: [
    CommonModule,
  FormsModule,
  MatSnackBarModule],
  templateUrl: './feedback-request.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackRequestComponent {
  textData = '';
  subjectData = '';
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private sessionStorageService: SessionStorageService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    ) { }

    sendMsg(subject: string, msg: any) {
      const profile: any = this.sessionStorageService.getItem('token');
      const textarea = document.getElementById('message') as HTMLTextAreaElement;
      const data = textarea.value.replace(/\n/g, '<br>');
      // console.log('message',data);
      Email.send({
        SecureToken : "9f0ad52c-ee22-45b7-b703-8427bc0e75fb", // old version Nov 1
        Host: "smtp.elasticemail.com",
        Username: "wonsup.jung.aws@gmail.com",
        Password: "E570B124ECE70B06FC3B37BF93D0C8C9B5D0",
        To : 'wonsup.jung@gmail.com',
        From : "wonsup.jung.aws@gmail.com",
        Subject :  subject + ": from offprice.main",
        Body : 'name:' + profile.user.displayName + ':' + '<br/> email' +':'+ profile.user.email + '<br/> message' + ': <br/>' + data 
      }).then((message: any) => {
        console.log(message);
        this.snackBar.open('Message sent successfully', 'Close', {
          duration: 2000,
        });
        this.subjectData = '';
        this.textData = '';
        this.cd.detectChanges();
        this.sharedMenuObservableService.closeFeedback.next(true);
      });
    }

}
