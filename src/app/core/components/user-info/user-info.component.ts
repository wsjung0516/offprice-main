import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@UntilDestroy()
@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule,
FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule

  ],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent {
  userInfoForm: FormGroup;
  isEditMode: boolean;
  submitButtonText: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode;
    this.userInfoForm = this.fb.group({
      companyName: ['', Validators.required],
      representativeName: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      address: this.fb.group({
        addressLine1: ['', Validators.required],
        addressLine2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        postalCode: ['', Validators.required]
      }),
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      termsAndConditions: [false, Validators.requiredTrue]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userInfoForm.valid) {
      // TODO: save the form data
      this.dialogRef.close();
    }
  }
}
