import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { DialogService } from 'primeng/dynamicdialog';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { EditarContactProveedorDialogoComponent } from '../dialogos/editar-contact-proveedor-dialogo/editar-contact-proveedor-dialogo.component';
import { CrearContactoProveedorDialogoComponent } from '../dialogos/crear-contacto-proveedor-dialogo/crear-contacto-proveedor-dialogo.component';
import { ContactoProveedorDetalles } from '../dto/contacto-proveedor-detalles.dto';

@Injectable({
  providedIn: 'root'
})
export class ContactoProveedorService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/contactos-proveedor`;

  crear(proveedorId: number, createContactoProveedorDto: any) {
    return this.http.post<void>(`${this.apiUrl}/${proveedorId}`, createContactoProveedorDto);
  }
  
  fetchAllByProveedor(proveedorId: Signal<string>) {
    return httpResource<ContactoProveedorDetalles[]>(() => ({
      url: `${this.apiUrl}?proveedorId=${proveedorId()}`
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<any | null>(() => ({
      url: `${this.apiUrl}/${id}`
    }), { defaultValue: null });
  }
  
  update(id: number, updateContactoProveedorDto: any) {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, updateContactoProveedorDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  crearContactoProveedorDialogo(proveedorId: number) {
    return this.dialogService.open(CrearContactoProveedorDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Crear contacto de proveedor',
      width: '700px',
      breakpoints: {
        '700px': '95%'
      },
      data: proveedorId
    });
  }
  
  editarContactoProveedorDialogo(contactoId: number) {
    return this.dialogService.open(EditarContactProveedorDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar contacto de proveedor',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: contactoId
    });
  }

}
