import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root'
})
export class CompressImageService {
  constructor(private imageCompress: NgxImageCompressService) {}
  compressImage(file: any): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      this.imageCompress
        .compressFile(file, -1, 100, 100, 600, 800)
        .then((result: any) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}