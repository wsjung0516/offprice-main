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
} from '../sidemenu/image-upload/image-upload.component';
import { SaleList } from '../core/models/sale-list.model';
import { Size, Color } from '../core/constants/data-define';
import { UserTokenService } from 'src/app/core/services/user-token.service';
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
  isLoading = true;
  selectedUnit = 'USD';
  nSizes: { name: string; value: number }[] = [];
  nColors: { name: string; value: string }[] = [];
  nMaterials: string;
  // nMaterials: { name: string}[] = [];
  jsonString = '';
  image_urls: string[] = [];
  description = '';
  uploadStartStatus = false; // This status is used to trigger upload image in image-upload.component.ts

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
    private userTokenService: UserTokenService
  ) {}

  ngOnInit() {
    this.isLoading = false;
    this.registerStatus = localStorage.getItem('registerStatus') ?? 'create';
    this.initRegisterForm();
    this.calledFromSaleList();
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
            // console.log('res', res);
            // this.registerForm.patchValue(res,{emitEvent: false});
            this.registerForm.get('vendor').setValue(res.vendor);
            this.registerForm.get('price').setValue(res.price);
            this.registerForm.get('product_name').setValue(res.product_name);
            this.imgURLs = res.image_urls.split(',');
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
  }

  private getImageUrls() {
    this.registerForm
      .get('image_urls')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((imageData: string[]) => {
        // console.log('imageData?', imageData);
        if (imageData?.length > 0) {
          this.image_urls = imageData;
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
      price: [0, Validators.required],
      size: [''],
      category: ['', Validators.required],
      material: [''],
      color: [''],
      image_urls: [''],
      user_id: ['', Validators.required],
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
        this.imgURLs
      );
      this._saleListService
        .updateSaleList(this.sale_list_id, finalData)
        .subscribe((res: any) => {
          // If update status is finished, change status to create
          this._notificationService.success('Update successfully');
          this._router.navigate(['/register-home/home/sale-list']);
        });
    }
  }

  uploadImage(files?: File) {
    if (this.registerStatus === 'update') {
      this.updateSaleList();
    } else {
      console.log('this.registerForm.value', this.registerForm.value);
      this.uploadStartStatus = true;

      // this.uploadSaleListToDB();
    }
  }

  private uploadSaleListToDB() {
    const finalData = this.deserializeData(
      this.registerForm.value,
      this.image_urls
    );
    this.userTokenService.getUserToken().subscribe((profile: any) => {
      if(profile) {
        finalData.user_id = profile.user.uid;
        console.log('finalData', finalData);
        this.createSaleList(finalData, profile);
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
  private deserializeData(data: Partial<SaleList>, image_urls: string[]) {
    // const user: any = this.sessionStorageService.getItem('token');
    // const userId: string = this.sessionStorageService.getItem('user_id');
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

  cancelUpload() {
    this.imgURLs = [];
    // this.file = null;
    this.progress = 0;
    this.registerForm.patchValue({ image_urls: '' });
    this.registerForm.reset();
    this._router.navigate(['/register-home/home/sale-list']);
  }

  private createSaleList(data: Partial<SaleList>, user:any) {
    // const userId = this.sessionStorageService.getItem('user_id');
    // const user: any =  this.sessionStorageService.getItem('token');
    // console.log('createSaleList', user);
    
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
          this.htmlText = '';
          this.uploadStartStatus = false;
        });
    } else {
      this._notificationService.alert('Input data is invalid');
      console.log('form is invalid');
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
