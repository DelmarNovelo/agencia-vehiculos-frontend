import { inject, Injectable, Signal } from '@angular/core';
import { Municipio } from '../interfaces/municipio.interface';
import { HttpClient, httpResource } from '@angular/common/http';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../../../../environments/environment.development';
import { CrearMunicipioDto } from '../dto/crear-municipio.dto';
import { CrearMunicipioDialogoComponent } from '../dialogos/crear-municipio-dialogo/crear-municipio-dialogo.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { EditarMunicipioDialogoComponent } from '../dialogos/editar-municipio-dialogo/editar-municipio-dialogo.component';
import { ActualizarMunicipioDto } from '../dto/actualizar-municipio.dto';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/municipios`;

  create(crearMunicipioDto: CrearMunicipioDto) {
    return this.http.post<Municipio>(`${this.apiUrl}`, crearMunicipioDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<Municipio[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchAllForSelect(departamentoId: Signal<number>) {
    return httpResource<Municipio[]>(() => ({
      url: `${this.apiUrl}/for-select/${departamentoId()}`
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<Municipio | null>(() => ({
      url: `${this.apiUrl}/${id}`
    }), { defaultValue: null });
  }

  update(id: number, updateMunicipioDto: ActualizarMunicipioDto) {
    return this.http.patch<Municipio>(`${this.apiUrl}/${id}`, updateMunicipioDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  crearMunicipioDialogo(departamentoId?: number) {
    return this.dialogService.open(CrearMunicipioDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Crear municipio',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: departamentoId
    });
  }

  editarMunicipioDialogo(municipioId: number) {
    return this.dialogService.open(EditarMunicipioDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar municipio',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: municipioId
    });
  }

}
