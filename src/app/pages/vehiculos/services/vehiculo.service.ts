import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { CrearVehiculoDto } from '../dto/crear-vehiculo.dto';
import { VehiculosListDto } from '../dto/vehiculos-list.dto';
import { DetallesVehiculoDto } from '../dto/detalles-vehiculo.dto';
import { VehiculoEdit } from '../interfaces/vehiculo.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarVehiculoDto } from '../dto/editar-vehiculo.dto';
import { VehiculoAutocomplete } from '../dto/vehiculo-autocomplete.dto';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/vehiculos`;

  create(crearVehiculoDto: CrearVehiculoDto) {
    return this.http.post<void>(`${this.apiUrl}`, crearVehiculoDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<VehiculosListDto[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchForAutocomplete(searchTerm: string) {
    return this.http.get<VehiculoAutocomplete[]>(`${this.apiUrl}/for-autocomplete?searchTerm=${searchTerm}`);
  }

  fetchOneDetail(vehiculoId: Signal<string>) {
    return httpResource<DetallesVehiculoDto | null>(() => ({
      url: `${this.apiUrl}/detalles/${vehiculoId()}`,
    }), { defaultValue: null });
  }

  fetchOne(vehiculoId: string) {
    return httpResource<VehiculoEdit | null>(() => ({
      url: `${this.apiUrl}/${vehiculoId}`,
    }), { defaultValue: null });
  }

  update(vehiculoId: string, updateVehiculoDto: EditarVehiculoDto) {
    return this.http.patch<VehiculoEdit>(`${this.apiUrl}/${vehiculoId}`, updateVehiculoDto);
  }

  remove(vehiculoId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${vehiculoId}`);
  }

}
