import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarClienteDialogoComponent } from '../dialogos/editar-cliente-dialogo/editar-cliente-dialogo.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { ActualizarClienteDto } from '../dto/actualizar-cliente.dto';
import { ClienteAutocomplete } from '../dto/cliente-autocomplete.dto';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/clientes`;

  create(crearClienteDto: any) {
    return this.http.post<{ id: number; message: string }>(this.apiUrl, crearClienteDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<any[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchAllForAutocomplete(searchTerm: string) {
    return this.http.get<ClienteAutocomplete[]>(`${this.apiUrl}/for-autocomplete?searchTerm=${searchTerm}`);
  }

  fetchOne(id: Signal<string>) {
    return httpResource<any | null>(() => ({
      url: `${this.apiUrl}/${id()}`
    }), { defaultValue: null });
  }

  fetchOneDetails(id: number) {
    return httpResource<any | null>(() => ({
      url: `${this.apiUrl}/${id}/detalles`
    }), { defaultValue: null });
  }

  update(id: number, actualizarClienteDto: ActualizarClienteDto) {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, actualizarClienteDto);
  }

  remove(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  editarClienteDialogo(clienteId: number) {
    return this.dialogService.open(EditarClienteDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar cliente',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: clienteId
    })
  }

}
