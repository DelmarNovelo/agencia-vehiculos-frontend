import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../../../../environments/environment.development';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { CrearRolDialogoComponent } from '../dialogos/crear-rol-dialogo/crear-rol-dialogo.component';
import { EditarRolDialogoComponent } from '../dialogos/editar-rol-dialogo/editar-rol-dialogo.component';
import { CrearRolDto } from '../dto/crear-rol.interface';
import { RolDto } from '../dto/rol.dto';
import { RolForSelectDto } from '../dto/rol-for-select.dto';
import { RolDetallesDto } from '../dto/rol-detalles.dto';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/roles`;

  create(crearRolDto: CrearRolDto) {
    return this.http.post<RolForSelectDto>(`${this.apiUrl}`, crearRolDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<RolDto[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchAllForSelect() {
    return httpResource<RolForSelectDto[]>(() => ({
      url: `${this.apiUrl}/for-select`
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<RolDetallesDto | null>(() => ({
      url: `${this.apiUrl}/${id}`
    }), { defaultValue: null });
  }

  update(id: number, updateRolDto: CrearRolDto) {
    return this.http.patch<RolForSelectDto>(`${this.apiUrl}/${id}`, updateRolDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  nuevoRolDialogo() {
    return this.dialogService.open(CrearRolDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nuevo rol',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      }
    });
  }

  editarRolDialogo(rolId: number) {
    return this.dialogService.open(EditarRolDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar rol',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: rolId
    });
  }

}
