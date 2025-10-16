import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ListaVenta } from '../dto/lista-venta.dto';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/ventas`;

  registrarVenta(ventaDto: any) {
    return this.http.post<any>(this.apiUrl, ventaDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<ListaVenta[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchOne(id: Signal<number>) {
    return httpResource<any | null>(() => ({
      url: `${this.apiUrl}/${id()}`,
    }), { defaultValue: null });
  }

  fetchByCliente(id: Signal<string>) {
    return httpResource<any>(() => ({
      url: `${this.apiUrl}/cliente/${id()}`,
    }), { defaultValue: null });
  }

}
