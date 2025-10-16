import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../../../../environments/environment.development';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { CrearTransmisionDto } from '../dto/crear-transmision.dto';
import { TransmisionForSelectDto } from '../dto/transmision-for-select.dto';
import { TransmisionListDto } from '../dto/transmision-list.dto';
import { CrearTransmisionDialogoComponent } from '../dialogos/crear-transmision-dialogo/crear-transmision-dialogo.component';
import { EditarTransmisionDialogoComponent } from '../dialogos/editar-transmision-dialogo/editar-transmision-dialogo.component';

@Injectable({
  providedIn: 'root'
})
export class TransmisionService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/transmisiones`;

  create(crearTransmisionDto: CrearTransmisionDto) {
    return this.http.post<TransmisionForSelectDto>(`${this.apiUrl}`, crearTransmisionDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<TransmisionListDto[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchAllForSelect() {
    return httpResource<TransmisionForSelectDto[]>(() => ({
      url: `${this.apiUrl}/for-select`
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<TransmisionForSelectDto | null>(() => ({
      url: `${this.apiUrl}/${id}`
    }), { defaultValue: null });
  }

  update(id: number, updateTransmisionDto: CrearTransmisionDto) {
    return this.http.patch<TransmisionForSelectDto>(`${this.apiUrl}/${id}`, updateTransmisionDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  nuevaTransmisionDialogo() {
    return this.dialogService.open(CrearTransmisionDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nueva transmisión',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      }
    });
  }

  editarTransmisionDialogo(transmisionId: number) {
    return this.dialogService.open(EditarTransmisionDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar transmisión',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: { transmisionId }
    });
  }

}
