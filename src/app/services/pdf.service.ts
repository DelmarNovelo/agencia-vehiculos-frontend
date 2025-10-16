import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = 'http://localhost:3000/pdf'; // Ajusta la URL según tu configuración

  constructor(private http: HttpClient) { }

  getPdfVenta(ventaId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/venta/${ventaId}`, {
      responseType: 'blob'
    });
  }
}
