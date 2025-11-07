import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private apiUrl = environment.apiUrl + '/feedback';

  constructor(private http: HttpClient) {}

  submitFeedback(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
