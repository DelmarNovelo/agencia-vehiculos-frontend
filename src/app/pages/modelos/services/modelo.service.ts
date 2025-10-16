import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../../../../environments/environment.development';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { CrearModeloDialogoComponent } from '../dialogos/crear-modelo-dialogo/crear-modelo-dialogo.component';
import { EditarModeloDialogoComponent } from '../dialogos/editar-modelo-dialogo/editar-modelo-dialogo.component';
import { CrearModeloDto } from '../dto/crear-modelo.dto';
import { ModeloListDto } from '../dto/modelo-list.dto';
import { ModeloForSelectDto } from '../dto/modelo.for-select.dto';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/modelos`;

  create(crearModeloDto: CrearModeloDto) {
    return this.http.post<ModeloForSelectDto>(`${this.apiUrl}`, crearModeloDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<ModeloListDto[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchAllForSelect() {
    return httpResource<ModeloForSelectDto[]>(() => ({
      url: `${this.apiUrl}/for-select`
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<ModeloForSelectDto | null>(() => ({
      url: `${this.apiUrl}/${id}`
    }), { defaultValue: null });
  }

  update(id: number, updateModeloDto: CrearModeloDto) {
    return this.http.patch<ModeloForSelectDto>(`${this.apiUrl}/${id}`, updateModeloDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  nuevoModeloDialogo() {
    return this.dialogService.open(CrearModeloDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nuevo modelo',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      }
    });
  }

  editarModeloDialogo(modeloId: number) {
    return this.dialogService.open(EditarModeloDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar modelo',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: { modeloId }
    });
  }

}
