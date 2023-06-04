import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedMenuObservableService } from '../../services/shared-menu-observable.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserTokenService } from '../../services/user-token.service';
import { UserFeedbackService } from './user-feedback.service';
import { DialogRef } from '@ngneat/dialog';

declare let Email: any;
interface Data {
  title: string;
}
@Component({
  selector: 'app-user-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './user-feedback.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFeedbackComponent {
  ref: DialogRef<Data, boolean> = inject(DialogRef);
  textData = '';
  subjectData = '';
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private userTokenService: UserTokenService,
    private userFeedbackService: UserFeedbackService
  ) {}

  sendMsg(subject: string, msg: any) {
    const data = this.textData.replace(/\n/g, '<br>');

    this.userTokenService.getUserToken().subscribe((profile: any) => {
      // console.log('message', profile);
      if (profile) {
        this.sendMessage(subject, profile, data);
        this.sendMessageToDB(subject, profile, data);
        this.ref.close(true);
      } else {
        this.snackBar.open('Please login first', 'Close', {
          duration: 2000,
        });
      }
    });
  }
  onCancel() {
    this.ref.close(false);
  }
  private sendMessageToDB(subject: string, profile: any, data: string) {
    const da = {
      subject: subject,
      message: data,
      email: profile.user.email,
      name: profile.user.displayName,
    };
    this.userFeedbackService.createUserFeedback(da).subscribe((res: any) => {
      // console.log(res);
    });
  }

  private sendMessage(subject: string, profile: any, data: string) {
    Email.send({
      SecureToken: '9f0ad52c-ee22-45b7-b703-8427bc0e75fb',
      Host: 'smtp.elasticemail.com',
      Username: 'wonsup.jung.aws@gmail.com',
      Password: 'E570B124ECE70B06FC3B37BF93D0C8C9B5D0',
      To: 'wonsup.jung@gmail.com',
      From: 'wonsup.jung.aws@gmail.com',
      Subject: subject + ': from offprice.main',
      Body:
        'name:' +
        profile.user.first_name +
        ':' +
        '<br/> email' +
        ':' +
        profile.user.email +
        '<br/> message' +
        ': <br/>' +
        data,
    }).then((message: any) => {
      // console.log(message);
      this.snackBar.open('Message sent successfully', 'Close', {
        duration: 2000,
      });
      this.subjectData = '';
      this.textData = null;
      this.cd.detectChanges();
      this.sharedMenuObservableService.closeFeedback.next(true);
    });
  }
}
