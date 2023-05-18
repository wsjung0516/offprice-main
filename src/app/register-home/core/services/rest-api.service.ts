import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private uploadImageUrl = environment.url + '/upload-image';

  constructor(private http: HttpClient) {}
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(this.uploadImageUrl, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json',
    });
  }
}
