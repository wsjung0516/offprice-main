import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserFeedback } from '../../models/user-feedback.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserFeedbackService {
  baseUrl = environment.url;
  constructor(private http: HttpClient) {}
  headers = { 'content-type': 'application/json' }; // 'Accept': 'application/json'

  createUserFeedback(data: Partial<UserFeedback>): Observable<UserFeedback> {
    const url = `${this.baseUrl}/user-feedback`;
    return this.http.post<UserFeedback>(url, data, { headers: this.headers });
  }
}
