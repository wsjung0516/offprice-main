import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(
    private snackBar: MatSnackBar,
  ) {}
  appearance: 'fill' | 'outline' | 'soft' = 'fill';
  type: 'info' | 'success' | 'error' = 'info'
  info(
    message: string,
    duration: number = 5000,
  ): void {
    this.appearance = 'fill';
    this.type = 'info';
    const config: MatSnackBarConfig = {
      duration: duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [`snackbar-type-${this.appearance}-${this.type}`],
    };
    this.snackBar.open(message, 'X', config);
  }
  warn(
    message: string,
    duration: number = 5000,
  ): void {
    this.appearance = 'fill';
    this.type = 'error';
    const config: MatSnackBarConfig = {
      duration: duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [`snackbar-type-${this.appearance}-${this.type}`],
    };
    this.snackBar.open(message, 'X', config);
  }
  success(
    message: string,
    duration: number = 5000,
  ): void {
    this.appearance = 'fill';
    this.type = 'success';
    const config: MatSnackBarConfig = {
      duration: duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [`snackbar-type-${this.appearance}-${this.type}`],
    };
    this.snackBar.open(message, 'X', config);
  }
}
