import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { CrearPrecioVentaDto } from '../dto/crear-precio-venta.dto';

@Injectable({
  providedIn: 'root'
})
export class PrecioVentaService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/precios-venta`;

  create(crearPrecioVentaDto: CrearPrecioVentaDto, vehiculoId: number) {
    return this.http.post<void>(`${this.apiUrl}/${vehiculoId}`, crearPrecioVentaDto);
  }
  
  fetchOne(precioVentaId: number) {
    return httpResource<any | null>(`${this.apiUrl}/${precioVentaId}`, { defaultValue: null });
  }

  update(precioVentaId: number, updatePrecioVentaDto: any) {
    return this.http.patch<any>(`${this.apiUrl}/${precioVentaId}`, updatePrecioVentaDto);
  }
  
}
