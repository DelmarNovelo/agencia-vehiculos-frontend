import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { DepartamentoForSelectDto } from '../dto/departamento-for-select.dto';
import { CrearDepartamentoDto } from '../dto/crear-departamento.dto';
import { DepartamentoResponseDto } from '../dto/departamento-response.dto';
import { Departamento } from '../interfaces/departamento.interface';
import { DepartamentoListDto } from '../dto/departamento-list.dto';
import { UpdateDepartamentoDto } from '../dto/update-departamento.dto';
import { DialogService } from 'primeng/dynamicdialog';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { CrearDepartamentoComponent } from '../dialogos/crear-departamento/crear-departamento.component';
import { EditarDepartamentoComponent } from '../dialogos/editar-departamento/editar-departamento.component';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/departamentos`;

  crearDepartamento(departamento: CrearDepartamentoDto) {
    return this.http.post<DepartamentoResponseDto>(`${this.apiUrl}`, departamento);
  }

  fetchAllForSelect() {
    return httpResource<DepartamentoForSelectDto[]>(() => ({
      url: `${this.apiUrl}/for-select`,
    }), { defaultValue: [] });
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<DepartamentoListDto[]>(() => ({
      url: `${this.apiUrl}/?searchTerm=${searchTerm()}`,
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<Departamento | null>(() => ({
      url: `${this.apiUrl}/${id}`,
    }), { defaultValue: null });
  }

  update(id: number, updateDepartamentoDto: UpdateDepartamentoDto) {
    return this.http.patch<DepartamentoListDto>(`${this.apiUrl}/${id}`, updateDepartamentoDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  crearDepartamentoDialogo() {
    return this.dialogService.open(CrearDepartamentoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nuevo Departamento',
      width: '600px',
      breakpoints: {
        '600px': '95%',
      }
    });
  }

  editarDepartamentoDialogo(departamentoId: number) {
    return this.dialogService.open(EditarDepartamentoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar Departamento',
      width: '600px',
      breakpoints: {
        '600px': '95%',
      },
      data: departamentoId,
    });
  }

}
