import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformeService {
  private apiUrl = 'http://localhost:3000/informes'; // Ajusta la URL según tu configuración

  constructor(private http: HttpClient) { }

  getSalesReport(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/sales-report?startDate=${startDate}&endDate=${endDate}`);
  }

  getTopClient(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-client?startDate=${startDate}&endDate=${endDate}`);
  }

  getProfitMargin(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profit-margin?startDate=${startDate}&endDate=${endDate}`);
  }
}
