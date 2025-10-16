import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../../../../environments/environment.development';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { CombustibleForSelectDto } from '../dto/combustible-for-select.dto';
import { CombustibleListDto } from '../dto/combustible-list.dto';
import { CrearCombustibleDto } from '../dto/crear-combustible.dto';
import { CrearCombustibleDialogoComponent } from '../dialogos/crear-combustible-dialogo/crear-combustible-dialogo.component';
import { EditarCombustibleDialogoComponent } from '../dialogos/editar-combustible-dialogo/editar-combustible-dialogo.component';

@Injectable({
  providedIn: 'root'
})
export class CombustibleService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/combustibles`;

  create(crearCombustibleDto: CrearCombustibleDto) {
    return this.http.post<CombustibleForSelectDto>(`${this.apiUrl}`, crearCombustibleDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<CombustibleListDto[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchAllForSelect() {
    return httpResource<CombustibleForSelectDto[]>(() => ({
      url: `${this.apiUrl}/for-select`
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<CombustibleForSelectDto | null>(() => ({
      url: `${this.apiUrl}/${id}`
    }), { defaultValue: null });
  }

  update(id: number, updateCombustibleDto: CrearCombustibleDto) {
    return this.http.patch<CombustibleForSelectDto>(`${this.apiUrl}/${id}`, updateCombustibleDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  nuevoCombustibleDialogo() {
    return this.dialogService.open(CrearCombustibleDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nuevo combustible',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      }
    });
  }

  editarCombustibleDialogo(combustibleId: number) {
    return this.dialogService.open(EditarCombustibleDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar combustible',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: { combustibleId }
    });
  }

}
