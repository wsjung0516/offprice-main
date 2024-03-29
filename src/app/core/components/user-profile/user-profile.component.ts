import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { User } from 'src/app/core/models/user.model';
// import { User } from 'src/app/register-home/core/models/user.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '@ngneat/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { format } from 'date-fns';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  from,
  map,
  Observable,
  skip,
  switchMap,
  toArray,
} from 'rxjs';
import { TermsAndConditionsComponent } from 'src/app/core/components/terms-and-condition/terms-and-conditions.component';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { UserTokenService } from 'src/app/core/services/user-token.service';
import { UserService } from 'src/app/user/user.service';
// import { ConfirmDialogComponent } from '../../core/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { errorTailorImports } from '@ngneat/error-tailor';
// import { group } from 'console';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

interface Data {
  user_id: string;
}
@UntilDestroy()
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
  CommonModule,
    HttpClientModule,
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
    // ConfirmDialogComponent,
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule,
    errorTailorImports,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  // ref: DialogRef<Data> = inject(DialogRef);
  @ViewChild('templateName') tName: TemplateRef<any>;
  myControl = new FormControl('');
  title = '';
  currentTitle = '';
  userId: string;
  createdDate: string;

  user: Partial<User> = {};
  disabled = false;
  mode = 'Update';

  address:  { key: any }[][] = [];
  // cities: { key: any }[][] = [];
  // selectedCity: { key: any }[][] = [];
  // states: { key: any }[][] = [];
  // selectedState: { key: any }[][] = [];
  // countries: { key: any }[][] = [];
  // selectedCountry: { key: any }[][] = [];
  postalCode: string[] = [];

  firstName = '';
  lastName = '';
  eMail = '';
  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    private matDialog: MatDialog,
    private userTokenService: UserTokenService,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private sessionStorageService: SessionStorageService
  ) {}

  contactForm = new UntypedFormGroup({
    first_name: new UntypedFormControl('', Validators.required),
    last_name: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', Validators.required),
    zipcode: new UntypedFormControl('', Validators.pattern(/^\d+$/)),
    phone_no: new UntypedFormControl('', Validators.pattern(/^[\d\-]+$/)),
    address1: new UntypedFormControl('', Validators.required),
    address2: new UntypedFormControl(),
    subscribe: new UntypedFormControl(false, Validators.requiredTrue),
    seller: new UntypedFormControl(false),
    store_name: new UntypedFormControl(),
    representative_name: new UntypedFormControl(),
    register_no: new UntypedFormControl(),
    representative_phone_no: new UntypedFormControl(
      '',
      Validators.pattern(/^[\d\-]+$/)
    ),
    store_address1: new UntypedFormControl(),
    store_address2: new UntypedFormControl(),
    store_zipcode: new UntypedFormControl('', Validators.pattern(/^\d+$/)),
  });
  private dialog = inject(DialogService);
  isDirty$: Observable<boolean>;
  beforeClose$: Observable<boolean>;
  // isSeller = false;
  ngOnInit() {
    // this.contactForm.valueChanges.subscribe((value) => {});
    // const id = '25b85792-ac77-4433-97bb-a622e03f3241'
    this.setSellerValidators();
  }
  ngAfterViewInit() {
    // To prvevent from writing the seller information because seller info
    // is managed by register-home module.
    // this.title = this.titleService.getTitle();
    this.currentTitle = this.sessionStorageService.getItem('title')
    this.userTokenService
      .getUserToken()
      .pipe(
        filter((profile: any) => !!profile),
        delay(500), // Insert to prevent from making userService.getUser() error
        switchMap((profile: any) => {
          // console.log('user', profile);
          return this.userService.getUser(profile.user.uid);
        })
      )
      .subscribe((user) => {
        setTimeout(() => {
          if( user === null) return;
          this.userId = user.user_id;
          this.createdDate = format(new Date(user.created_at), 'dd/MM/yyyy');
          this.contactForm.patchValue(user);
          this.contactForm.get('address1').setValue(user.address1);
          this.contactForm.get('store_address1').setValue(user.store_address1);
  
          this.cd.detectChanges();
          this.completeAddress('address1', 0);
          this.completeAddress('store_address1', 1);
        });
      });
    // this.user-profile = this.ref.data.user-profile;
    // this.disabled = this.ref.data.disabled;
  }
  private setSellerValidators() {
    this.contactForm.get('seller').valueChanges.subscribe((sellerValue) => {
      const storeNameControl = this.contactForm.get('store_name');
      const representativeNameControl = this.contactForm.get(
        'representative_name'
      );
      const registerNoControl = this.contactForm.get('register_no');
      const storeAddress1Control = this.contactForm.get('store_address1');
      const storeZipcodeControl = this.contactForm.get('store_zipcode');

      if (sellerValue) {
        storeNameControl.setValidators([Validators.required]);
        representativeNameControl.setValidators([Validators.required]);
        registerNoControl.setValidators([Validators.required, einValidator()]);
        storeAddress1Control.setValidators([Validators.required]);
        storeZipcodeControl.setValidators([Validators.required]);
      } else {
        storeNameControl.clearValidators();
        representativeNameControl.clearValidators();
        registerNoControl.clearValidators();
        storeAddress1Control.clearValidators();
        storeZipcodeControl.clearValidators();
      }

      storeNameControl.updateValueAndValidity();
      representativeNameControl.updateValueAndValidity();
      registerNoControl.updateValueAndValidity();
      storeAddress1Control.updateValueAndValidity();
      storeZipcodeControl.updateValueAndValidity();
    });
  }
  private completeAddress(control: string, arg: number) {
    this.contactForm
      .get(control)
      .valueChanges.pipe(
        skip(1),
        filter((value) => value !== '' && value !== null),
        untilDestroyed(this),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value: string) => {
          return this.http.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyDhlv6bqw8LpkJdw5oikJD_mAuqs1jpjgA`
          );
        })
      )
      .subscribe((response) => {
        const searchResults = response as any;
        // Extract the city, state, and country information from the search results
        if (searchResults.status === 'OK') {
          // console.log('searchResults', searchResults, searchResults.status);
          from(searchResults.results).pipe(
            untilDestroyed(this),
              map((result: any) => {
                return {key: result.formatted_address};
              }),
              toArray(),
            ).subscribe((result: any) => {
              this.address[arg] = [...result]
              // console.log('result', result, this.address[arg]);
            }
          );
        }

        //
        const postal = searchResults?.results?.map((result: any) => {
          return result.address_components.filter((component: any) =>
            component.types.includes('postal_code')
          );
        });
        if (postal[0]?.length > 0) {
          this.postalCode[arg] = postal[0][0]?.short_name ?? '';
          if (arg === 0) {
            this.contactForm.get('zipcode').setValue(this.postalCode[0]);
          }
          if (arg === 1) {
            this.contactForm.get('store_zipcode').setValue(this.postalCode[1]);
          }
        }
        this.cd.detectChanges();
      });
  }

  checkSameValueAsAbove(event: any) {
    console.log('event', event.checked);
    if (event.checked) {
      this.contactForm
        .get('store_address1')
        .setValue(this.contactForm.get('address1').value);
      this.contactForm
        .get('store_address2')
        .setValue(this.contactForm.get('address2').value);
      this.contactForm
        .get('store_zipcode')
        .setValue(this.contactForm.get('zipcode').value);
      this.cd.detectChanges();
    } else {
      this.contactForm.get('store_address1').setValue('', { emitEvent: false });
      this.contactForm.get('store_address2').setValue('');
      this.contactForm.get('store_zipcode').setValue('');
      this.cd.detectChanges();
    }
  }

  onSubmit() {
    console.log('this.mode', this.mode);
    if (this.contactForm.valid) {
      // console.log('Form Submitted!');
    } else {
      this.snackBar.open('Please check the field conditions!', 'Close', {
        duration: 3000,
      });
      return;
    }
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
        //console.log('response', response);
        // this.ref.close(true);
        this.dialogRef.close(response);
      });
  }
  updateUser() {
    console.log('this.contactForm.value', this.contactForm.value);
    const user: User = {
      ...this.contactForm.value,
      ...{ updated_at: new Date() },
    };
    this.userService
      .updateUser(this.userId, user)
      .subscribe((response: any) => {
        console.log('update user response', response);
        this.dialogRef.close(response);
      });
  }
  deleteUser() {
    this.userService
      .deleteUser(this.user.user_id)
      .subscribe((response: any) => {
        console.log('response', response);
      });
  }
  openTermsAndConditions() {
    this.matDialog.open(TermsAndConditionsComponent, {
      hasBackdrop: false,
      disableClose: true,
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
function einValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const einPattern = /^\d{2}-\d{7}$/;
    const value = control.value;

    if (!value) {
      // 값이 없는 경우, 유효성 검사를 통과시킵니다.
      return null;
    }

    return einPattern.test(value) ? null : { invalidEIN: true };
  };
}
export const sampleUser: Partial<User> = {
  user_id: '1', // number 1
  first_name: 'John', // string 'John'
  last_name: 'Doe', // string 'Doe'
  email: 'abc@gmail.com', // string ''
  zipcode: '12345', // string,
  phone_no: '1234567890', // string,
  address1: '123 Main St', // string,
  address2: 'Apt 1', // string,
  created_at: new Date(), // Date,
  subscribe: true, // boolean,
};
