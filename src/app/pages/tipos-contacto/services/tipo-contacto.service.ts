import { inject, Injectable, Signal } from '@angular/core';
import { CrearTipoContactoDialogoComponent } from '../dialogos/crear-tipo-contacto-dialogo/crear-tipo-contacto-dialogo.component';
import { EditarTipoContactoDialogoComponent } from '../dialogos/editar-tipo-contacto-dialogo/editar-tipo-contacto-dialogo.component';
import { DialogService } from 'primeng/dynamicdialog';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { TipoContacto } from '../interfaces/tipo-contacto.interface';
import { CrearTipoContactoDto } from '../dto/crear-tipo-contacto.dto';

@Injectable({
  providedIn: 'root'
})
export class TipoContactoService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/tipos-contacto`;

  create(crearTipoContactoDto: CrearTipoContactoDto) {
    return this.http.post<TipoContacto>(`${this.apiUrl}`, crearTipoContactoDto);
  }
  
  fetchAll(searchTerm: Signal<string>) {
    return httpResource<TipoContacto[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchAllForSelect() {
    return httpResource<TipoContacto[]>(() => ({
      url: `${this.apiUrl}/for-select`
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<TipoContacto | null>(() => ({
      url: `${this.apiUrl}/${id}`
    }), { defaultValue: null });
  }

  update(id: number, updateTipoContactoDto: CrearTipoContactoDto) {
    return this.http.patch<TipoContacto>(`${this.apiUrl}/${id}`, updateTipoContactoDto);
  }
  
  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  nuevoTipoContactoDialogo() {
    return this.dialogService.open(CrearTipoContactoDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nuevo tipo de contacto',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      }
    });
  }

  editarTipoContactoDialogo(tipoContactoId: number) {
    return this.dialogService.open(EditarTipoContactoDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar tipo de contacto',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: tipoContactoId
    });
  }

}
