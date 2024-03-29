import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

  constructor(
    public snackBar: MatSnackBar,
    private zone: NgZone) { }

  showSuccess(message: string): void {
    // Had an issue with the snackbar being ran outside of angular's zone.
    this.zone.run(() => {
      this.snackBar.open(message, 'Dance',{duration: 5000});
    });
  }

  showError(message: string): void {
    if( message.includes('FirebaseError') ) return;
    if( message.includes('NG04002') ) return;
    this.zone.run(() => {
      // The second parameter is the text in the button.
      // In the third, we send in the css class for the snack bar.
      this.snackBar.open(message, 'X');
      // this.snackBar.open(message, 'X',{duration: 15000});
      // this.snackBar.open(message, 'X', {panelClass: ['error']});
    });
  }
}
