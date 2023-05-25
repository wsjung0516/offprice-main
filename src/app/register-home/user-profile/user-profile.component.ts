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
  Inject,
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
import { User } from 'src/app/core/models/user.model';
// import { User } from 'src/app/register-home/core/models/user.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { format } from 'date-fns';
import { UserService } from './user.service';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  skip,
  switchMap,
} from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionStorageService } from 'src/app/register-home/core/services/session-storage.service';
import { UserTokenService } from 'src/app/core/services/user-token.service';
import { ar, fi, th } from 'date-fns/locale';
import { TermsAndConditionsComponent } from 'src/app/core/components/terms-and-condition/terms-and-conditions.component';
// import { ConfirmDialogComponent } from '../../core/components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
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
    MatDialogModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  // ref: DialogRef<Data> = inject(DialogRef);

  title = 'Update User';
  userId: string;
  createdDate: string;

  user: Partial<User> = {};
  disabled = false;
  mode = 'Update';
  @ViewChild('templateName') tName: TemplateRef<any>;

  address = '';
  cities: { key: any }[][] = [];
  selectedCity: { key: any }[][] = [];
  states: { key: any }[][] = [];
  selectedState: { key: any }[][] = [];
  countries: { key: any }[][] = [];
  selectedCountry: { key: any }[][] = [];
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
    private userTokenService: UserTokenService
  ) {}

  contactForm = new UntypedFormGroup({
    first_name: new UntypedFormControl(),
    last_name: new UntypedFormControl(),
    email: new UntypedFormControl(),
    zipcode: new UntypedFormControl(),
    phone_no: new UntypedFormControl(),
    address1: new UntypedFormControl(),
    address2: new UntypedFormControl(),
    city: new UntypedFormControl(),
    state: new UntypedFormControl(),
    country: new UntypedFormControl(),
    subscribe: new UntypedFormControl(false),
    seller: new UntypedFormControl(false),
    store_name: new UntypedFormControl(),
    representative_name: new UntypedFormControl(),
    register_no: new UntypedFormControl(),
    representative_phone_no: new UntypedFormControl(),
    store_address1: new UntypedFormControl(),
    store_address2: new UntypedFormControl(),
    store_city: new UntypedFormControl(),
    store_state: new UntypedFormControl(),
    store_country: new UntypedFormControl(),
    store_zipcode: new UntypedFormControl(),
  });
  private dialog = inject(DialogService);
  isDirty$: Observable<boolean>;
  beforeClose$: Observable<boolean>;
  // isSeller = false;
  ngOnInit() {
    // this.contactForm.valueChanges.subscribe((value) => {});
    // const id = '25b85792-ac77-4433-97bb-a622e03f3241'
  }
  ngAfterViewInit() {

    this.userTokenService
      .getUserToken()
      .pipe(
        filter((profile: any) => !!profile),
        switchMap((profile: any) => {
          return this.userService.getUser(profile.user.uid);
        })
      )
      .subscribe((user) => {
        console.log('user', user);
        this.userId = user.user_id;
        this.createdDate = format(new Date(user.created_at), 'dd/MM/yyyy');
        this.contactForm.patchValue(user);
        this.contactForm.get('address1').setValue(user.address1);
        this.contactForm.get('store_address1').setValue(user.store_address1);

        this.cd.detectChanges();
        this.completeAddress('address1', 0);
        this.completeAddress('store_address1', 1);
      });
    // this.user-profile = this.ref.data.user-profile;
    // this.disabled = this.ref.data.disabled;
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
        // console.log('searchResults', searchResults);
        const city = searchResults?.results?.map((result: any) => {
          return result.address_components
            .filter((component: any) => {
              return (
                component.types.includes('locality') ||
                component.types.includes('neighborhood') ||
                component.types.includes('political')
              );
            })
            .map((item: any) => item.short_name);
        });
        let cities: any[] = [];
        city[0]?.forEach((item: any) => {
          cities.push({ key: item });
        });
        this.cities[arg] = [...cities];
        //
        const stat = searchResults?.results?.map((result: any) => {
          return result.address_components
            .filter((component: any) => {
              return (
                component.types.includes('administrative_area_level_2') ||
                component.types.includes('administrative_area_level_1')
              );
            })
            .map((item: any) => item.short_name);
        });
        let state: any[] = [];
        stat[0]?.forEach((item: any) => {
          state.push({ key: item });
        });
        this.states[arg] = [...state];
        //
        const count = searchResults?.results?.map((result: any) => {
          return result.address_components
            .filter((component: any) => {
              return component.types.includes('country');
            })
            .map((item: any) => item.short_name);
        });
        let country: any[] = [];
        count[0]?.forEach((item: any) => {
          country.push({ key: item });
        });
        this.countries[arg] = [...country];
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
        .get('store_city')
        .setValue(this.contactForm.get('city').value);
      this.contactForm
        .get('store_state')
        .setValue(this.contactForm.get('state').value);
      this.contactForm
        .get('store_country')
        .setValue(this.contactForm.get('country').value);
      this.contactForm
        .get('store_zipcode')
        .setValue(this.contactForm.get('zipcode').value);
      this.cd.detectChanges();
    } else {
      this.contactForm.get('store_address1').setValue('', { emitEvent: false });
      this.contactForm.get('store_address2').setValue('');
      this.contactForm.get('store_city').setValue('');
      this.contactForm.get('store_state').setValue('');
      this.contactForm.get('store_country').setValue('');
      this.contactForm.get('store_zipcode').setValue('');
      this.cd.detectChanges();
    }
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
        // this.ref.close(true);
      });
  }
  updateUser() {
    console.log('this.contactForm.value', this.contactForm.value);
    const user: User = {
      ...this.contactForm.value,
      ...{ updated_at: new Date() },
    };
    console.log('user-profile----', user);
    this.userService
      .updateUser(this.userId, user)
      .subscribe((response: any) => {
        console.log('response', response);
        this.closeDialog();

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
  // displayUser(user-profile: Partial<User>) {
  //   if (!user-profile) {
  //     return;
  //   }

  //   const {
  //     first_name,
  //     last_name,
  //     email,
  //     phone_no,
  //     address1,
  //     address2,
  //     city,
  //     state,
  //     country,
  //     zipcode,
  //     subscribe,
  //     user_id,
  //     created_at,
  //   } = user-profile;

  //   this.contactForm.patchValue({
  //     first_name,
  //     last_name,
  //     email,
  //     phone_no,
  //     address1,
  //     address2,
  //     city,
  //     state,
  //     country,
  //     zipcode,
  //     subscribe,
  //   });

  //   this.userId = user_id ? user_id.toString() : '';
  //   // this.createdDate = format(new Date(created_at), 'MM/dd/yyyy hh:mm:ss');
  // }
  openTermsAndConditions() {
    this.matDialog.open(TermsAndConditionsComponent, {
      hasBackdrop: false,
      disableClose: true,
    });
    // this.dialog.open(TermsAndConditionsComponent, {
    //   data: { data: 'Terms and Conditions' },

    //   backdrop: false
    // });
  }
  closeDialog() {
    this.dialogRef.close();
  }
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
