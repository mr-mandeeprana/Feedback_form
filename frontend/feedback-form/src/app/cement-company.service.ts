import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CementCompanyService {
  private apiUrl = environment.apiUrl + '/cement-companies';

  constructor(private http: HttpClient) {}

  getCompanies(country: string): Observable<any> {
  return this.http.get(`${this.apiUrl}?country=${country}`);
}

addCompany(name: string, country: string): Observable<any> {
  return this.http.post(this.apiUrl, { name, country });
}

}
