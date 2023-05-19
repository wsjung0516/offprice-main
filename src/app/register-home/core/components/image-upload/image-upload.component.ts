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
import { pipe } from 'rxjs';
export interface FileData {
  name: string;
  type: string;
  data: string;
}
// @UntilDestroy()
@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './image-upload.component.html',
  styles: [
    `
      mat-card-content {
        padding: 0 !important;
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
  @Input() set uploadStartStatus ( val: boolean) {
    if (val) {
      this.uploadToCloud();
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
  constructor(
    private cd: ChangeDetectorRef,
    private restApiService: RestApiService,
    private compressImageService: CompressImageService
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
  compressedFile: File[] = [];
  async onSelectedImageFile(file: Event) {
    // console.log('files ---', file, file.target);
    const target = event.target as HTMLInputElement;
    // this.selectedFiles = target.files;
    const fileData = await this.uploadImages(target.files);
    this.compressedFile = await this.compressImage(fileData);
    // this.uploadToCloud();
  }
  private uploadToCloud() {
    from(this.compressedFile)
      .pipe(
        // tap(() => console.log('tap ---')),
        takeUntil(this.destroy$),
        concatMap((file: File) => this.restApiService.uploadImage(file).pipe(toResponseBody())
        ),
        map((res: any) => res.path),
        toArray()
      )
      .subscribe((res: any) => {
        this.progress = 0;
        // console.log('res-- ', res)
        this.onChange(res);
      });
  }

  async compressImage(fileList: FileData[]) {
    return await Promise.all(
      fileList.map(async (file: FileData) => {
        const compressedBlob = await this.compressImageService.compressImage(
          file.data
        );
        return await convertBlobToFile(compressedBlob, file.name, file.type);
      })
    );
  }

  async uploadImages(files: FileList | null = null): Promise<FileData[]> {
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
    this.imgURLs = [];
    for (const file of Array.from(files)) {
      try {
        const fileDatum = await this.readImageFile(file);
        fileData.push(fileDatum);
        this.imgURLs.push(fileDatum.data);
        this.cd.detectChanges();
        console.log('imgURLs ---', this.imgURLs);
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
