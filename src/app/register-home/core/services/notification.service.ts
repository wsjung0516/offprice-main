import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

  constructor(
    public snackBar: MatSnackBar,
    private zone: NgZone) { }

  success(message: string): void {
    // Had an issue with the snackbar being ran outside of angular's zone.
    this.zone.run(() => {
      this.snackBar.open(message, 'Success',{duration: 5000});
    });
  }

  alert(message: string): void {
    this.zone.run(() => {
      // The second parameter is the text in the button.
      // In the third, we send in the css class for the snack bar.
      this.snackBar.open(message, 'X');
      // this.snackBar.open(message, 'X',{duration: 15000});
      // this.snackBar.open(message, 'X', {panelClass: ['error']});
    });
  }
}
