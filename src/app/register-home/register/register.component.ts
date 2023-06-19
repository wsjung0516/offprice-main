import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { QuillEditorComponent } from './quill-editor/quill-editor.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { Categories, Sizes } from '../core/constants/data-define';
import { SelectSizeVcaComponent } from '../sidemenu/select-size-vca/select-size-vca.component';
import { MaterialVcaComponent } from '../sidemenu/material-vca/material-vca.component';
// import { ProgressComponent } from 'src/app/core/services/progress.component';
import { CategorySubmenuVcaComponent } from '../sidemenu/category-submenu-vca/category-submenu-vca.component';
import { SaleListService } from '../sale-list/sale-list.service';
import { NotificationService } from '../core/services/notification.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ColorVcaComponent } from '../sidemenu/color-vca/color-vca.component';
import { SizeScaleVcaComponent } from '../sidemenu/size-scale-vca/size-scale-vca.component';
import { Category1VcaComponent } from '../sidemenu/category1-vca/category1-vca.component';
import {
  FileData,
  ImageUploadComponent,
} from '../core/components/image-upload/image-upload.component';
import { SaleList } from 'src/app/core/models/sale-list.model';
import { Size, Color } from '../core/constants/data-define';
import { UserTokenService } from 'src/app/core/services/user-token.service';
import { errorTailorImports } from '@ngneat/error-tailor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { RegisterAuthService } from 'src/app/register-home/auth/login/services/register-auth.service';
import {
  Categories2,
  Category,
  Product,
  IStatus
} from 'src/app/core/constants/data-define';
import { StatusVcaComponent } from '../sidemenu/status-vca/status-vca.component';
import { DeleteSaleListItemService } from 'src/app/core/services/delete-sale-list-item.service';
import { Meta, Title } from '@angular/platform-browser';
import { MakeRegisterWhereConditionService } from './../core/services/make-register-where-condition.service';
@UntilDestroy()
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
CommonModule,
    MatCardModule,
    MatButtonModule,
    QuillEditorComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
    SelectSizeVcaComponent,
    MaterialVcaComponent,
    CategorySubmenuVcaComponent,
    ColorVcaComponent,
    // ProgressComponent,
    RouterModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ImageUploadComponent,
    SizeScaleVcaComponent,
    errorTailorImports,
    Category1VcaComponent,
    StatusVcaComponent
  ],
  templateUrl: './register.component.html',
  styles: [
    `
      img {
        width: auto;
        height: 40rem;
        object-fit: cover;
      }
      .discount-radio-group {
        display: flex;
        flex-direction: column;
        margin: 15px 0;
        align-items: flex-start;
      }
      .box-size {
        width: 3rem;
        height: 3rem;
        margin: 0.25rem;
        border: 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 0.25rem;
      }
      .sel_class {
        background-color: lightgray;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  // message = '';
  // imagePath: any;
  imgURLs: string[] = [];
  imgSmURLs: string[] = [];
  registerForm: FormGroup;
  vendorName: string;
  categories: Product[] = [];
  sizes = Sizes;
  progress = 0;
  price = 0;
  registerStatus = 'create | update';
  // file: File;
  sale_list_id = '';
  htmlText: any;
  category = '';
  selected_category = '';
  category1: Category = { id: '1', key: 'All', value: '' };
  size: string[] = [];
  sizeArray: string[] = [];
  material: string[] = [];
  color: string[] = [];
  isLoading = false;
  selectedUnit = 'USD';
  nSizes: { name: string; value: number }[] = [];
  jsonString = '';
  image_urls: string[] = [];
  image_sm_urls: string[] = [];
  description = '';
  uploadStartStatus = false; // This status is used to trigger upload image in image-upload.component.ts
  // To reset selected size from select-size-vca.component.ts
  reset_size = false;
  reset_color = false;
  reset_material = false;
  reset_category = false;
  reset_status = false;
  reset_category_submenu = false;
  status1 = 'Sale' ;
  // sale_status: IStatus = { key: 'sale', value: 'sale' } ;

  constructor(
    private fb: FormBuilder,
    // private _restApiService: RestApiService,
    // private _compressImageService: CompressImageService,
    private _saleListService: SaleListService,
    private cd: ChangeDetectorRef,
    private _notificationService: NotificationService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private sessionStorageService: SessionStorageService,
    private userTokenService: UserTokenService,
    private snackBar: MatSnackBar,
    private sharedMenuObservableService: SharedMenuObservableService,
    private authService: RegisterAuthService,
    private deleteSaleListItemService: DeleteSaleListItemService,
    private metaTagService: Meta,
    private titleService: Title,
    private makeRegisterWhereConditionService: MakeRegisterWhereConditionService
  ) {}

  ngOnInit() {
    this.metaTagService.updateTag(
      {
        name: 'description',
        content: "Don't miss out on our closeout sale with incredible discounts on select products.",
      },
    );
    this.titleService.setTitle('closeout sale');

    this.isLoading = false;
    this.registerStatus = this.sessionStorageService.getItem('registerStatus') ?? 'create';
    this.initRegisterForm();
    // To edit sale list
    this.calledFromSaleList();
    // Call from table-list.component.ts when complete delete sale list
    this.sharedMenuObservableService.resultDeleteSaleListItem$
      .pipe(untilDestroyed(this))
      .subscribe((sale_list_id: any) => {
        if (sale_list_id === this.sale_list_id) {
          this.imgURLs = [];
          this.imgSmURLs = [];
          // this.file = null;
          this.progress = 0;
          this.registerForm.patchValue({ image_urls: '' });
          this.registerForm.reset();
          this._router.navigate(['/register-home/home/sale-list']);
        }
      });
  }
  private calledFromSaleList() {
    this._activatedRoute.paramMap
      .pipe(untilDestroyed(this))
      .subscribe((val: any) => {
        if (Object.keys(val['params']).length === 0) return;
        const id = val['params']?.id;
        if (id) {
          this.sale_list_id = id;
          this._saleListService.getSaleList(id).subscribe((res: SaleList) => {
            // console.log('res', res);
            // this.registerForm.patchValue(res,{emitEvent: false});
            this.registerForm.get('vendor').setValue(res.vendor);
            this.registerForm.get('price').setValue(res.price);
            this.registerForm.get('product_name').setValue(res.product_name);
            this.imgURLs = res.image_urls.split(',');
            this.imgSmURLs = res.image_sm_urls.split(',');
            this.htmlText = res.description;
            this.category1 = { id: res.category1, key: '', value: '' };
            this.selected_category = res.category;
            this.status1 = res.status1;
            this.size = res.size.split(',');
            this.sizeArray = res.sizeArray.split(',');
            this.material = res.material.split(',');
            this.color = res.color.split(',');
            this.cd.detectChanges();
          });
        }
      });
  }

  ngAfterViewInit() {
    this.selectedUnit = 'USD';
    this.getImageUrls();
    this.sharedMenuObservableService.isImageLoading$
      .pipe(untilDestroyed(this))
      .subscribe((val: boolean) => {
        this.isLoading = val;
      });
  }

  private getImageUrls() {
    this.registerForm
      .get('image_urls')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((imageData: string[]) => {
        if (imageData?.length > 0) {
          const imageXlUrls = imageData.filter((val) => val.includes('XL'));
          const imageSmUrls = imageData.filter((val) => val.includes('SM'));
          this.image_urls = imageXlUrls;
          this.image_sm_urls = imageSmUrls;
          // console.log('imageData?', this.image_urls, this.image_sm_urls);
          this.uploadSaleListToDB();
        }
      });
  }

  private initRegisterForm() {
    // FormGroup과 FormControl 생성

    this.registerForm = this.fb.group({
      product_name: [''],
      vendor: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      size: ['', Validators.required],
      category: ['', Validators.required],
      category_1: ['1', Validators.required],
      material: ['', Validators.required],
      color: ['', Validators.required],
      status: ['', Validators.required],
      image_urls: [''], // This value is assigned after processing in image-upload.component.ts
      user_id: [''],    // This value is assigned in uploadSaleListToDB()
    });
  }


  updateSaleList() {
    // console.log('updateSaleList', this.registerForm.value, this.imgURLs);
    if (this.registerStatus === 'update') {
      const finalData = this.makeUpdateData(
        this.registerForm.value,
        this.imgURLs,
        this.imgSmURLs
      );
      // console.log('this.registerForm.value', this.registerForm.value);
      console.log('finalData', finalData);
      this._saleListService
        .updateSaleList(this.sale_list_id, finalData)
        .subscribe((res: any) => {
          // If update status is finished, change status to create
          this._notificationService.success('Update successfully');
          this._router.navigate(['/register-home/home/sale-list']);
            // To refresh the table.
            this.makeRegisterWhereConditionService.refreshObservable.next('');
          });

      if( this.registerForm.valid) {
      } else {
        this.snackBar.open('Please check the field conditions!', 'Close', {
          duration: 3000,
        });
      }
    }
  }

  makeUpdateOrCreate(files?: File) {
    if (this.registerStatus === 'update') {
      this.updateSaleList();
    } else {
      // Check form validation
      if( this.registerForm.valid) {
        // Start upload image, Send signal to image-upload.component.ts
        this.uploadStartStatus = true;
      } else {
        // console.log('this.registerForm.valid', this.registerForm.valid, this.registerForm.value);
        this.snackBar.open('Please check the input fields!', 'Close', {
          duration: 3000,
        });
      }
    }
  }
  // This function is called from image-upload.component.ts through this.getImageUrls()
  private uploadSaleListToDB() {
    const finalData = this.deserializeData(
      this.registerForm.value,
      this.image_urls,
      this.image_sm_urls
    );
    this.userTokenService.getUserToken().subscribe((profile: any) => {
      if (profile) {
        finalData.user_id = profile.user.uid;
        // console.log('finalData', finalData);
        this.createSaleList(finalData, profile);
        //this.authService.checkIfUserCouponsAvailable();
        // this.checkIfSellerSetService.checkIfUserCouponsAvailable();
      }
    });
  }

  /**
category:"Clothing"
color:(3) ['Green', 'Blue', 'Navy']
colorArray:(3) ['#008000', '#0000FF', '#000080']
description:"<p>Title</p><p>1.test</p><ol><li>teest2</li></ol>"
image_urls:(3) ['https://offprice_bucket.storage.googleapis.com/8c3…6-cffa-11ed-98bc-02a5d2e812b5_E_1682452798410.jpg', 'https://offprice_bucket.storage.googleapis.com/8c3…7-cffa-11ed-98bc-02a5d2e812b5_E_1682452799764.jpg', 'https://offprice_bucket.storage.googleapis.com/8c3…e-cffa-11ed-98bc-02a5d2e812b5_E_1682452800988.jpg']
material:(3) ['Rayon', 'Spandex', 'Silk']
price:200
product_name:"aaa"
size:(3) ['MD', 'LG', 'XL']
sizeArray:(3) ['100', '200', '300']
user_id:"8e2452c0-bf35-4ece-acdf-6ff434bc1197"
vendor:"bbb"
*/
  private makeUpdateData(
    data: any,
    // data: Partial<SaleList>,
    image_urls: string[],
    image_sm_urls: string[]
  ) {

    console.log('data', data);
    const adata: any = {
      product_name: data.product_name,
      // user_id: user.user.uid,
      description: data.description !== '' ? data.description : '',
      // image_urls: image_urls.join(','),
      // image_sm_urls: image_sm_urls.join(','),
      vendor: data.vendor,
      price: data.price,
      category: data.category,
      category1: this.category1.id,
      size: data.size !== '' ? data.size.size.join(',') : '',
      sizeArray: data.size !== '' ? data.size.sizeArray.filter((item:any) =>  item !== '').join(',') : '',
      color: data.color !== '' ? data.color.join(',') : '',
      material: data.material !== '' ? data.material.join(',') : '',
      colorArray: '',
      status1: data.status !== '' ? data.status : 'Sale',
    };
    if (adata.size === '' || adata.color === '' || adata.material === '') {
      if (adata.size === '') {
        delete adata.size;
        delete adata.sizeArray;
      }
      if (adata.color === '') {
        delete adata.color;
      }
      if (adata.material === '') {
        delete adata.material;
      }
    }
    return adata;
  }
  private deserializeData(
    data: any,
    // data: Partial<SaleList>,
    image_urls: string[],
    image_sm_urls: string[]
  ) {

    console.log('data', data);
    const adata: Partial<SaleList> = {
      product_name: data.product_name,
      // user_id: user.user.uid,
      description: data.description !== '' ? data.description : '',
      image_urls: image_urls.join(','),
      image_sm_urls: image_sm_urls.join(','),
      vendor: data.vendor,
      price: data.price,
      category: data.category,
      category1: this.category1.id,
      size: data.size.size.join(','),
      sizeArray: data.size.sizeArray.filter((item:any) =>  item !== '').join(','),
      color: data.color.join(','),
      colorArray: '',
      material: data.material.join(','),
      status1: data.status,
    };
    return adata;
  }
  deleteEditImage(index: number) {}
  cancelUpload() {
    this.imgURLs = [];
    this.imgSmURLs = [];
    // this.file = null;
    this.progress = 0;
    this.registerForm.patchValue({ image_urls: '' });
    this.registerForm.reset();
    this._router.navigate(['/register-home/home/sale-list']);
  }
  deleteItem() {
    // Call to table-list component to delete item
    console.log('deleteItem', this.sale_list_id);
    this.deleteSaleListItemService.delete(this.sale_list_id.toString());
    // To refresh the table.
    this.makeRegisterWhereConditionService.refreshObservable.next('');

  }

  private createSaleList(data: Partial<SaleList>, user: any) {
    // Check if this.registerForm.get('image_urls') is empty

    this.registerForm.patchValue({
      user_id: user.user.uid,
    });
    this._saleListService
      .createSaleList(data)
      // .createSaleList(this.registerForm.value)
      .subscribe((res: any) => {
        // console.log('res', res);
        this._notificationService.success('Register success');
        this.registerForm.reset();
        this.imgURLs = [];
        this.imgSmURLs = [];
        this.htmlText = '';
        this.uploadStartStatus = false;
        this.reset_size = true;
        this.reset_material = true;
        this.reset_color = true;
        this.reset_category = true;
        this.reset_status = true;
        this.reset_category_submenu = true;
        // To refresh the table.
        this.makeRegisterWhereConditionService.refreshObservable.next('');

      });
  }

  // Receive data from quill editor
  createdDescription(event: any) {
    if (event.html === undefined) return;
    // console.log('quill editor',event.html);
    this.description = event.html;
    // this.registerForm.patchValue({ description: event.html });
  }
  ngOnDestroy() {
    this.sessionStorageService.setItem('registerStatus', 'create');
  }
}
