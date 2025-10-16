import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarDireccionDialogoComponent } from '../dialogos/editar-direccion-dialogo/editar-direccion-dialogo.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { Direccion } from '../interfaces/direccion.interface';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/direcciones`;

  fetchOne(id: number) {
    return httpResource<Direccion | null>(() => ({
      url: `${this.apiUrl}/${id}`,
    }), { defaultValue: null });
  }

  editarDireccionDialogo(id: number) {
    return this.dialogService.open(EditarDireccionDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar Dirección',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: id
    });
  }

  update(id: number, updateDireccionDto: any) {
    return this.http.patch<Direccion>(`${this.apiUrl}/${id}`, updateDireccionDto);
  }
  
}
