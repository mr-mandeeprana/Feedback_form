import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  private baseUrl = 'http://localhost:5000/api/designations'; // Update this if your backend is deployed

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
