import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { UnidadVehicularListDto } from '../dto/unidad-vehicular-list.dto';
import { UnidadVehicularDetallesDto } from '../dto/unidad-vehicular-detalles.dto';
import { UnidadVehicular } from '../interfaces/unidad-vehicular.interface';

@Injectable({
  providedIn: 'root'
})
export class UnidadVehicularService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/unidades-vehiculares`;

  crearUnidadVehicular(unidadVehicular: any, vehiculoId: number) {
    return this.http.post<UnidadVehicularListDto>(`${this.apiUrl}/${vehiculoId}`, unidadVehicular);
  }

  fetchOne(unidadVehicularId: number) {
    return httpResource<UnidadVehicularDetallesDto | null>(() => ({
      url: `${this.apiUrl}/${unidadVehicularId}`,
    }), { defaultValue: null });
  }

  fetchAllByVehicle(vehiculoId: Signal<string>) {
    return httpResource<UnidadVehicularListDto[]>(() => ({
      url: `${this.apiUrl}/by-vehicle/${vehiculoId()}`,
    }), { defaultValue: [] });
  }

  fetchAllByVehicleForSale(vehiculoId: number) {
    return this.http.get<UnidadVehicular[]>(`${this.apiUrl}/by-vehicle-for-sale/${vehiculoId}`);
  }

  updateUnidadVehicular(unidadVehicular: any, unidadVehicularId: number) {
    return this.http.patch<UnidadVehicularListDto>(`${this.apiUrl}/${unidadVehicularId}`, unidadVehicular);
  }

  removeUnidadVehicular(unidadVehicularId: number) {
    return this.http.delete<void>(`${this.apiUrl}/${unidadVehicularId}`);
  }

}
