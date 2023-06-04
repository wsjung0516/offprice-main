/*
OnSelectImageFile()
  - uploadImages()
    - readImageFile()
      - readImageFileAsDataURL()
  - compressImageAndUpload()
  - restApiService.uploadImage()
*/

import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RestApiService } from 'src/app/register-home/core/services/rest-api.service';
import { CompressImageService } from 'src/app/register-home/core/services/compress-image.service';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import {
  concatMap,
  filter,
  from,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
  toArray,
} from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedMenuObservableService } from 'src/app/core/services/shared-menu-observable.service';
import { pipe } from 'rxjs';
import { set } from 'date-fns';
export interface FileData {
  name: string;
  type: string;
  data: string;
}
// @UntilDestroy()
@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './image-upload.component.html',
  styles: [
    `
      mat-card-content {
        padding: 0 !important;
      }

      .file-upload {
        position: relative;
        display: inline-block;
      }

      .file-upload label {
        background-color: green; /* 배경색 변경 */
        padding: 10px 20px; /* 크기 조절 */
        border-radius: 4px; /* 모서리 둥글게 */
        color: white;
        cursor: pointer;
      }

      .file-upload input[type='file'] {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ImageUploadComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent
  implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() registerStatus = 'create';
  // Before upload image to cloud, set uploadStartStatus to false
  // When the all the data for upload to DB is ready in the register.component.ts,
  // the trigger for uploading image is received from register.component.ts
  @Input() set uploadStartStatus(val: boolean) {
    if (val) {
      this.uploadToCloud();
    } else {
      // Finished uploading image to cloud, reset imageUrls
      this.imgURLs = [];
    }
  }
  @Input() set imageUrls(val: string[]) {
    // console.log('imageUrls ---', val);
    this.imgURLs = val;
    this.count = 0;
    this.cd.detectChanges();
  }
  imgURLs: string[] = [];
  imgURL: string | null = null;
  selectedImage = '';
  // message: string | null = null;

  destroy = new Subject<any>();
  destroy$ = this.destroy.asObservable();

  imagePath = '';
  message = '';
  onChange: any = () => {};
  onTouch: any = () => {};
  selectedFiles: FileList | null = null;
  file: File;
  fileData: FileData[] = [];
  progress = 0;
  isLoading = false;
  constructor(
    private cd: ChangeDetectorRef,
    private restApiService: RestApiService,
    private compressImageService: CompressImageService,
    private snackBar: MatSnackBar,
    private sharedMenuObservableService: SharedMenuObservableService
  ) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('ngOnChanges ---',changes);
    if (this.imageUrls && this.imageUrls.length > 0) {
      this.imgURL = this.imageUrls[0];
      this.cd.detectChanges();
    }
  }
  onAddImage() {
    this.imgURLs.push(this.imgURL);
    this.cd.detectChanges();
  }
  selectImage(image: string) {
    this.selectedImage = image;
  }
  onDeleteImage() {
    const index = this.imgURLs.indexOf(this.selectedImage);
    const index2 = index * 2;
    this.imgURLs.splice(index, 1);
    this.compressedFiles.splice(index2 + 1, 1);
    this.compressedFiles.splice(index2, 1);
    // this.tempArr.splice(index, 1);
    console.log('delete index ---', this.imgURLs, this.compressedFiles);
    this.selectedImage = this.imgURLs[0] ?? '';
    this.cd.detectChanges();
  }

  // rawFiles: File[] = [];
  tempArr: any[] = [];
  compressedFiles: File[] = [];
  async onSelectedImageFile(file: Event) {
    // console.log('files ---', file, file.target);
    const target = event.target as HTMLInputElement;
    // this.selectedFiles = target.files;
    const fileData = await this.makeImagesFromDevice(target.files);
    const rawFiles = await this.compressImage(fileData);
    this.tempArr.push(Array.from(rawFiles));
    this.tempArr = this.tempArr.flat();
    this.compressedFiles = this.tempArr;
    console.log('compressedFiles ---', this.compressedFiles);

    // console.log('compressedFiles ---', this.compressedFiles);
    // this.uploadToCloud();
  }
  private uploadToCloud() {
    // from(this.compressedFiles)
    from(this.compressedFiles)
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.sharedMenuObservableService.isImageLoading.next(true);
        }),
        takeUntil(this.destroy$),
        concatMap((file: File) =>
          this.restApiService.uploadImage(file).pipe(toResponseBody())
        ),
        map((res: any) => res.path),
        toArray()
      )
      .subscribe(
        (res: any) => {
          this.progress = 0;
          // console.log('res-- ', res)
          this.tempArr = [];
          this.compressedFiles = [];
          this.isLoading = false;
          this.sharedMenuObservableService.isImageLoading.next(false);
          this.onChange(res);
        },
        (err) => {
          this.sharedMenuObservableService.isImageLoading.next(false);
          this.isLoading = false;
          this.snackBar.open(err.message, 'Close', {
            duration: 2000,
          });
        }
      );
  }
  async compressImage(fileList: FileData[]) {
    const resultFiles = [];
    for (const file of fileList) {
      const [xlCompressedBlob, smCompressedBlob] = await Promise.all([
        this.compressImageService.compressImage(file.data),
        this.compressImageService.compressSmImage(file.data),
      ]);
      const xlFile = await convertBlobToFile(
        xlCompressedBlob,
        file.name + '-XL-',
        file.type
      );
      const smFile = await convertBlobToFile(
        smCompressedBlob,
        file.name + '-SM-',
        file.type
      );
      resultFiles.push(xlFile, smFile);
    }
    return resultFiles;
  }

  async makeImagesFromDevice(
    files: FileList | null = null
  ): Promise<FileData[]> {
    if (!files || files.length === 0) {
      return [];
    }

    for (const file of Array.from(files)) {
      const mimeType = file.type;
      if (!mimeType.match(/^image\//)) {
        throw new Error('Only images are supported.');
      }
    }

    const fileData: FileData[] = [];
    // this.imgURLs = [];
    for (const file of Array.from(files)) {
      try {
        const fileDatum = await this.readImageFile(file);
        fileData.push(fileDatum);
        this.imgURLs.push(fileDatum.data);
        this.selectedImage = this.imgURLs[0];
        this.cd.detectChanges();
        //console.log('imgURLs ---', this.imgURLs);
      } catch (error) {
        console.error('Error reading image file:', error);
        throw error;
      }
    }

    return fileData;
  }
  count = 0;
  async readImageFile(file: File): Promise<FileData> {
    const imgURL = await this.readFileAsDataURL(file);
    // if (this.count === 0) {
    //   this.imgURL = imgURL;
    //   this.cd.detectChanges();
    //   this.count++;
    // }
    return {
      name: file.name,
      type: file.type,
      data: imgURL,
    };
  }

  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('File could not be read'));
        }
      };
      reader.onerror = (event) => {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  }

  writeValue(value: any): void {
    // this.priceRange = value;
  }
  registerOnChange(fn: object): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: object): void {
    this.onTouch = fn;
  }
  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }
}
export function uploadProgress<T>(cb: (progress: number) => void) {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.UploadProgress) {
      cb(Math.round((100 * event.loaded) / event.total));
    }
  });
}

export function toResponseBody<T>() {
  return (source: Observable<HttpEvent<T>>) =>
    source.pipe(
      filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
      map((response: HttpEvent<T>) => response as HttpResponse<T>),
      map((response: HttpResponse<T>) => response.body)
    );
}

const convertBlobToFile = (src: any, fileName: string, mimeType: string) => {
  return fetch(src)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], fileName, { type: mimeType });
    });
};
