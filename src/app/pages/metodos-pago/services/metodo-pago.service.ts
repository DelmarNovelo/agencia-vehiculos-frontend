import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../../../../environments/environment.development';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { CrearMetodoPagoDto } from '../dto/crear-metodo-pago.dto';
import { MetodoPago } from '../interfaces/metodo-pago.interface';
import { CrearMetodoPagoDialogoComponent } from '../dialogos/crear-tipo-pago-dialogo/crear-metodo-pago-dialogo.component';
import { EditarMetodoPagoDialogoComponent } from '../dialogos/editar-metodo-pago-dialogo/editar-metodo-pago-dialogo.component';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/metodos-pago`;

  create(crearMetodoPagoDto: CrearMetodoPagoDto) {
    return this.http.post<MetodoPago>(`${this.apiUrl}`, crearMetodoPagoDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<MetodoPago[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchAllForSelect() {
    return httpResource<MetodoPago[]>(() => ({
      url: `${this.apiUrl}/for-select`
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<MetodoPago | null>(() => ({
      url: `${this.apiUrl}/${id}`
    }), { defaultValue: null });
  }

  update(id: number, updateMetodoPagoDto: CrearMetodoPagoDto) {
    return this.http.patch<MetodoPago>(`${this.apiUrl}/${id}`, updateMetodoPagoDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  nuevoMetodoPagoDialogo() {
    return this.dialogService.open(CrearMetodoPagoDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nuevo método de pago',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      }
    });
  }

  editarMetodoPagoDialogo(metodoPagoId: number) {
    return this.dialogService.open(EditarMetodoPagoDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar método de pago',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: metodoPagoId
    });
  }

}
