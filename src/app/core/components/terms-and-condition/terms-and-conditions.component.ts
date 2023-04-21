import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@ngneat/dialog';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
export interface Data {
  data: string;
}
@Component({
  selector: 'app-terms-and-condition',
  standalone: true,
  imports: [CommonModule,
  MatDialogModule],
  templateUrl: './terms-and-conditions.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsAndConditionsComponent {
  // ref: DialogRef<Data> = inject(DialogRef);
  constructor(
    public dialogRef: MatDialogRef<TermsAndConditionsComponent>,

  ) { }
  onClose() {
    this.dialogRef.close();
    // this.ref.close();
  }

}
