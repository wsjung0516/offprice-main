import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  inject,
  AfterViewInit,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  MaxLengthValidator,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../models/user.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { format } from 'date-fns';
import { UserService } from '../user.service';
// import { DialogRef, DialogService } from '@ngneat/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Observable,
} from 'rxjs';
interface Data {
  user: Partial<User>;
  disabled: boolean;
  mode: string;
}
import { ConfirmDialogComponent } from '../../core/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    ConfirmDialogComponent,
    MatSelectModule,
    MatDialogModule
    // NzModalModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent implements OnInit, AfterViewInit {
  // ref: DialogRef<Data> = inject(DialogRef);

  title: string = 'Create User';
  userId: string;
  createdDate: string;

  user: Partial<User> = {};
  disabled: boolean = false;
  mode: string = 'Create';
  @ViewChild('templateName') tName: TemplateRef<any>;

  contactForm = new UntypedFormGroup({
    first_name: new UntypedFormControl(),
    last_name: new UntypedFormControl(),
    email: new UntypedFormControl(),
    bod: new UntypedFormControl(),
    gender: new UntypedFormControl(),
    zipcode: new UntypedFormControl(),
    phone_no: new UntypedFormControl(),
    address1: new UntypedFormControl(),
    address2: new UntypedFormControl(),
    point: new UntypedFormControl(),
    status: new UntypedFormControl(),
    subscribe: new UntypedFormControl(),
  });
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<CreateUserComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}
  // private dialog = inject(DialogService);
  isDirty$: Observable<boolean>;

  beforeClose$: Observable<boolean>;
  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      // this.mode = this.ref.data.mode;
      // this.user = this.ref.data.user;
      // this.disabled = this.ref.data.disabled;
      this.displayUser(this.user);

    }, 0);
  }
  onSubmit() {
    console.log('this.mode', this.mode);
    switch (this.mode) {
      case 'Create':
        this.createUser();
        break;
      case 'Update':
        this.updateUser();
        break;
      case 'Delete':
        this.deleteUser();
        break;
      default: // create
    }
  }
  createUser() {
    this.userService
      .createUser(this.contactForm.value)
      .subscribe((response: any) => {
        console.log('response', response);
        this.dialogRef.close(true);
        // this.ref.close(true);
      });
  }
  updateUser() {
    // console.log ('this.contactForm.value', this.contactForm.value);
    this.userService
      .updateUser(this.user.user_id, this.contactForm.value)
      .subscribe((response: any) => {
        console.log('response', response);
        this.dialogRef.close(true);
        // this.ref.close(true);
      });
  }
  deleteUser() {
    this.userService
      .deleteUser(this.user.user_id)
      .subscribe((response: any) => {
        console.log('response', response);
      });
  }
  displayUser(user: Partial<User>) {
    if (user) {
      this.contactForm.patchValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        bod: user.bod,
        gender: user.gender,
        zipcode: user.zipcode,
        phone_no: user.phone_no,
        address1: user.address1,
        address2: user.address2,
        point: user.point,
        status: user.status,
        subscribe: user.subscribe,
      });
      this.userId = user.user_id ? user.user_id.toString() : '';
      this.createdDate = format(
        new Date(user.created_at),
        'MM/dd/yyyy hh:mm:ss',
      );
    }
  }
}

export const sampleUser: User = {
  user_id: '1', // number 1
  first_name: 'John', // string 'John'
  last_name: 'Doe', // string 'Doe'
  email: 'abc@gmail.com', // string ''
  bod: new Date(), // Date,
  gender: 'Male', // string,
  zipcode: '12345', // string,
  phone_no: '1234567890', // string,
  address1: '123 Main St', // string,
  address2: 'Apt 1', // string,
  point: 100, // number,
  status: 'Active', // string,
  created_at: new Date(), // Date,
  subscribe: true, // boolean,
};
