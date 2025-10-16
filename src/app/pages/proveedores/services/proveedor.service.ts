import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../../../../environments/environment.development';
import { ProveedorDetalles } from '../dto/proveedor-detalles.dto';
import { EditarProveedorDialogoComponent } from '../dialogos/editar-proveedor-dialogo/editar-proveedor-dialogo.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { ProveedorAutocomplete } from '../dto/proveedor-autocomplete.dto';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/proveedores`;

  create(crearClienteDto: any) {
    return this.http.post<{ id: number; message: string }>(this.apiUrl, crearClienteDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<any[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchAllForAutocomplete(searchTerm: string) {
    return this.http.get<ProveedorAutocomplete[]>(`${this.apiUrl}/for-autocomplete?searchTerm=${searchTerm}`);
  }

  fetchOne(id: Signal<string>) {
    return httpResource<ProveedorDetalles | null>(() => ({
      url: `${this.apiUrl}/${id()}`
    }), { defaultValue: null });
  }

  fetchOneDetails(id: number) {
    return httpResource<any | null>(() => ({
      url: `${this.apiUrl}/${id}/detalles`
    }), { defaultValue: null });
  }

  update(id: number, actualizarProveedorDto: any) {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, actualizarProveedorDto);
  }

  remove(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  editarProveedorDialogo(dialogData: { id: number, razonSocial: string, nit?: string }) {
    return this.dialogService.open(EditarProveedorDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar proveedor',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: dialogData
    });
  }

}
