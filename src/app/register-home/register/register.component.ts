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
import { ProgressComponent } from 'src/app/register-home/core/services/progress.component';
import { CategoryVcaComponent } from '../sidemenu/category-vca/category-vca.component';
import { SaleListService } from '../sale-list/sale-list.service';
import { NotificationService } from '../core/services/notification.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SessionStorageService } from '../core/services/session-storage.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ColorVcaComponent } from '../sidemenu/color-vca/color-vca.component';
import { SizeScaleVcaComponent } from '../sidemenu/size-scale-vca/size-scale-vca.component';
import {
  FileData,
  ImageUploadComponent,
} from '../core/components/image-upload/image-upload.component';
import { SaleList } from 'src/app/core/models/sale-list.model';
import { Size, Color } from '../core/constants/data-define';
import { UserTokenService } from 'src/app/core/services/user-token.service';
import { errorTailorImports } from '@ngneat/error-tailor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedParentObservableService } from 'src/app/core/services/shared-parent-observable.service';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service'; 
import { AuthService } from 'src/app/register-home/auth/login/services/auth.service';
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
    CategoryVcaComponent,
    ColorVcaComponent,
    ProgressComponent,
    RouterModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ImageUploadComponent,
    SizeScaleVcaComponent,
    errorTailorImports,
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
  categories = Categories;
  sizes = Sizes;
  progress = 0;
  price = 0;
  registerStatus = 'create | update';
  // file: File;
  sale_list_id = '';
  htmlText: any;
  category = '';
  size: string[] = [];
  sizeArray: string[] = [];
  material: string[] = [];
  color: string[] = [];
  colorArray: string[] = [];
  isLoading = false;
  selectedUnit = 'USD';
  nSizes: { name: string; value: number }[] = [];
  nColors: { name: string; value: string }[] = [];
  nMaterials: string;
  // nMaterials: { name: string}[] = [];
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
    private sharedParentObservableService: SharedParentObservableService,
    private shredMenuObservableService: SharedMenuObservableService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = false;
    this.registerStatus = localStorage.getItem('registerStatus') ?? 'create';
    this.initRegisterForm();
    // To edit sale list
    this.calledFromSaleList();
    // Call from table-list.component.ts when complete delete sale list
    this.shredMenuObservableService.resultDeleteSaleListItem$.pipe(untilDestroyed(this)).subscribe((sale_list_id: any) => {
      if( sale_list_id === this.sale_list_id) {
        this.imgURLs = [];
        this.imgSmURLs = [];
        // this.file = null;
        this.progress = 0;
        this.registerForm.patchValue({ image_urls: '' });
        this.registerForm.reset();
        this._router.navigate(['/register-home/home/sale-list']);
      }
    })

  }
  private calledFromSaleList() {
    this._activatedRoute.paramMap
      .pipe(untilDestroyed(this))
      .subscribe((val: any) => {
        if(Object.keys(val['params']).length === 0) return;
        const id = val['params']?.id;
        if (id) {
          this.sale_list_id = id;
          this._saleListService.getSaleList(id).subscribe((res: SaleList) => {
            console.log('res', res);
            // this.registerForm.patchValue(res,{emitEvent: false});
            this.registerForm.get('vendor').setValue(res.vendor);
            this.registerForm.get('price').setValue(res.price);
            this.registerForm.get('product_name').setValue(res.product_name);
            this.imgURLs = res.image_urls.split(',');
            this.imgSmURLs = res.image_sm_urls.split(',');
            this.htmlText = res.description;
            this.category = res.category;
            this.size = res.size.split(',');
            this.sizeArray = res.sizeArray.split(',');
            this.material = res.material.split(',');
            this.color = res.color.split(',');
            this.colorArray = res.colorArray.split(',');
            this.cd.detectChanges();
          });
        }
      });
  }

  ngAfterViewInit() {
    this.selectedUnit = 'USD';
    this.getSizes();
    this.getColors();
    this.getMaterials();
    this.getImageUrls();
    this.sharedParentObservableService.isImageLoading$
    .pipe(untilDestroyed(this)).subscribe((val: boolean) => {
      this.isLoading = val;
    })
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
          console.log('imageData?', this.image_urls, this.image_sm_urls);
          this.uploadSaleListToDB();
        }
      });
  }

  private getMaterials() {
    this.registerForm
      .get('material')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((val: any[]) => {
        // console.log('val?', val?.join(':'));
        if(val?.length > 0) {
          this.nMaterials = val?.join(',');
        }
      });
  }

  private getColors() {
    this.registerForm
      .get('color')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((val: any[]) => {
        this.nColors = [];
        if (val?.length > 0) {
          val.forEach((color: any) => {
            this.nColors.push({
              name: color.name,
              value: color.value,
            });
            this.cd.detectChanges();
          });
        }
      });
  }

  private getSizes() {
    this.registerForm
      .get('size')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((val: any[]) => {
        this.nSizes = [];
        console.log('size ---?', val);
        if (val?.length > 0) {
          val.forEach((element: any) => {
            this.nSizes.push({ name: element.name, value: 0 });
            this.cd.detectChanges();
          });
        }
        if (this.registerStatus === 'update') {
          let element: string[] = [];
          // 사이즈의 종류를 20개 이상으로 선택하지 않을 것으로 가정한다.
          for (let i = 0; i < 20; i++) {
            element[i] = i < this.sizeArray.length ? this.sizeArray[i] : '';
          }
          const sizeArrayControl = this.registerForm.get('sizeArray');
          if (sizeArrayControl) {
            sizeArrayControl.setValue(element);
          }
          this.cd.detectChanges();
        }
      });
  }

  private initRegisterForm() {
    // FormGroup과 FormControl 생성

    this.registerForm = this.fb.group({
      product_name: [''],
      vendor: ['', Validators.required],
      description: [''],
      price: ['',Validators.required],
      size: ['', Validators.required],
      category: ['', Validators.required],
      material: ['',Validators.required],
      color: ['',Validators.required],
      image_urls: [''],
      user_id: [''],
      sizeArray: this.fb.array(this.createSizeFormControls()),
      colorArray: this.fb.array(this.createColorFormControls()),
    });
  }

  private createSizeFormControls(): FormControl[] {
    const formControls: FormControl[] = [];
    // 사이즈의 종류를 20개 이상으로 선택하지 않을 것으로 가정한다.
    // 20개를 미리 생성했다.
    for (let i = 0; i < 20; i++) {
      formControls.push(this.fb.control(''));
    }
    return formControls;
  }
  private createColorFormControls(): FormControl[] {
    const formControls: FormControl[] = [];
    for (let i = 0; i < 10; i++) {
      formControls.push(this.fb.control(''));
    }
    return formControls;
  }
  updateSaleList() {
    console.log('updateSaleList', this.registerForm.value);
    if (this.registerStatus === 'update') {
      const finalData = this.deserializeData(
        this.registerForm.value,
        this.imgURLs,
        this.imgSmURLs
      );
      console.log('this.registerForm.value', this.registerForm.value);
      // if( this.registerForm.valid) {
        this._saleListService
          .updateSaleList(this.sale_list_id, finalData)
          .subscribe((res: any) => {
            // If update status is finished, change status to create
            this._notificationService.success('Update successfully');
            this._router.navigate(['/register-home/home/sale-list']);
          });

      // } else { 
      //   this.snackBar.open('Please check the field conditions!', 'Close', {
      //     duration: 3000,
      //   });
      // }
    }
  }

  makeUpdateOrCreate(files?: File) {
    if (this.registerStatus === 'update') {
      this.updateSaleList();
    } else {
      this.uploadStartStatus = true;
    }
  }
  private uploadSaleListToDB() {
    const finalData = this.deserializeData(
      this.registerForm.value,
      this.image_urls,
      this.image_sm_urls
    );
    this.userTokenService.getUserToken().subscribe((profile: any) => {
      if(profile) {
        finalData.user_id = profile.user.uid;
        console.log('finalData', finalData);
        this.createSaleList(finalData, profile);
        this.authService.checkIfUserCouponsAvailable();
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
  private deserializeData(data: Partial<SaleList>, image_urls: string[], image_sm_urls: string[]) {
    const tSize: string[] = [];
    const tColor: string[] = [];
    const tSizeArray: string[] = [];
    const tColorArray: string[] = [];

    this.nSizes.forEach((element: any) => {
      tSize.push(element.name);
    });
    this.nSizes.forEach((element: any, index) => {
      tSizeArray.push(data.sizeArray[index].toString());
    });
    this.nColors.forEach((element: any) => {
      tColor.push(element.name);
    });
    this.nColors.forEach((element: any) => {
      tColorArray.push(element.value);
    });

    // console.log('userId', userId);
    const adata: Partial<SaleList> = {
      product_name: data.product_name,
      // user_id: user.user.uid,
      description: this.description,
      image_urls: image_urls.join(','),
      image_sm_urls: image_sm_urls.join(','),
      vendor: data.vendor,
      price: data.price,
      category: data.category,
      size: tSize.join(','),
      sizeArray: tSizeArray.join(','),
      color: tColor.join(','),
      colorArray: tColorArray.join(','),
      material: this.nMaterials,
    };
    console.log('final data', adata);
    return adata;
  }
  deleteEditImage(index: number) {
  }
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
    this.shredMenuObservableService.deleteSaleListItem.next(this.sale_list_id.toString());
  }

  private createSaleList(data: Partial<SaleList>, user:any) {
    // Check if this.registerForm.get('image_urls') is empty
    
    this.registerForm.patchValue({
      user_id: user.user.uid,
    });
    // Check form validation
    if (this.registerForm.status === 'VALID') {
      // submit form
      this._saleListService
        .createSaleList(data)
        // .createSaleList(this.registerForm.value)
        .subscribe((res: any) => {
          console.log('res', res);
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
        });
    }
  }

  // Receive data from quill editor
  createdDescription(event: any) {
    if (event.html === undefined) return;
    // console.log('quill editor',event.html);
    this.description = event.html;
    // this.registerForm.patchValue({ description: event.html });
  }
  ngOnDestroy() {
    localStorage.setItem('registerStatus', 'create');
  }
}
