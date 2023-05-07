import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedMenuObservableService } from '../core/services/shared-menu-observable.service';
import { SessionStorageService } from './../core/services/session-storage.service';

declare let Email: any; 
@Component({
  selector: 'app-feedback-request',
  standalone: true,
  imports: [CommonModule,
FormsModule],
  templateUrl: './feedback-request.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackRequestComponent {
  constructor(
    private sharedMenuObservableService: SharedMenuObservableService,
    private sessionStorageService: SessionStorageService
  ) { }
  sendMsg(msg: string) {
    const profile: any = this.sessionStorageService.getItem('token');
    if (!profile) return
    console.log('message',msg);
    Email.send({
      SecureToken : "9f0ad52c-ee22-45b7-b703-8427bc0e75fb", // old version Nov 1
      Host: "smtp.elasticemail.com",
      Username: "wonsup.jung@gmail.com",
      Password: "E570B124ECE70B06FC3B37BF93D0C8C9B5D0",
      To : 'wonsup.jung@gmail.com',
      From : 'wonsup.jung.aws@gmail.com',
      Subject : "This is the feedback from homepage",
      Body : 'name:' + profile.user.displayName + ':' + '<br/> email' +':'+ profile.user.email + '<br/> message' + ':' + msg
    }).then((message: any) => {
      console.log(message);
    });
    this.sharedMenuObservableService.closeFeedback.next(true);
  }

}
