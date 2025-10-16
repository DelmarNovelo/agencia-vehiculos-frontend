import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../../../../environments/environment.development';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { CrearTipoVehiculoDto } from '../dto/crear-tipo-vehiculo.dto';
import { TipoVehiculoForSelectDto } from '../dto/tipo-vehiculo-for-select.dto';
import { TipoVehiculoListDto } from '../dto/tipo-vehiculo-list.dto';
import { CrearTipoVehiculoDialogoComponent } from '../dialogos/crear-tipo-vehiculo-dialogo/crear-tipo-vehiculo-dialogo.component';
import { EditarTipoVehiculoDialogoComponent } from '../dialogos/editar-tipo-vehiculo-dialogo/editar-tipo-vehiculo-dialogo.component';

@Injectable({
  providedIn: 'root'
})
export class TipoVehiculoService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/tipos-vehiculo`;

  create(crearTipoVehiculoDto: CrearTipoVehiculoDto) {
    return this.http.post<TipoVehiculoForSelectDto>(`${this.apiUrl}`, crearTipoVehiculoDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<TipoVehiculoListDto[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchAllForSelect() {
    return httpResource<TipoVehiculoForSelectDto[]>(() => ({
      url: `${this.apiUrl}/for-select`
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<TipoVehiculoForSelectDto | null>(() => ({
      url: `${this.apiUrl}/${id}`
    }), { defaultValue: null });
  }

  update(id: number, updateTipoVehiculoDto: CrearTipoVehiculoDto) {
    return this.http.patch<TipoVehiculoForSelectDto>(`${this.apiUrl}/${id}`, updateTipoVehiculoDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  nuevoTipoVehiculoDialogo() {
    return this.dialogService.open(CrearTipoVehiculoDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nuevo tipo de vehículo',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      }
    });
  }

  editarTipoVehiculoDialogo(tipoVehiculoId: number) {
    return this.dialogService.open(EditarTipoVehiculoDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar tipo de vehículo',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: { tipoVehiculoId }
    });
  }

}
