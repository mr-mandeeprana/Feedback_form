import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  private baseUrl = environment.apiUrl + '/designations';

  constructor(private http: HttpClient) {}

  // GET: Fetch all designations
  getDesignations(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // POST: Add a new designation
  addDesignation(data: { designation: string }) {
  return this.http.post(`${this.baseUrl}`, data); // data must have "designation" key
}
}
