import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private http = inject(HttpClient)

  private apiUrl = `${environment.apiUrl}/compras`;

  registrarCompra(compraData: any) {
    return this.http.post<void>(this.apiUrl, compraData);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<any[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchOne(id: Signal<number>) {
    return httpResource<any | null>(() => ({
      url: `${this.apiUrl}/${id()}`,
    }), { defaultValue: null });
  }

  fetchByProveedor(id: Signal<string>) {
    return httpResource<any>(() => ({
      url: `${this.apiUrl}/proveedor/${id()}`,
    }), { defaultValue: null });
  }

}
