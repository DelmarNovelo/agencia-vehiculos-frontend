import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarContactoDialogoComponent } from '../dialogos/editar-contacto-dialogo/editar-contacto-dialogo.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { CrearContactoDialogoComponent } from '../dialogos/crear-contacto-dialogo/crear-contacto-dialogo.component';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/contactos`;

  create(createContactoDto: any) {
    return this.http.post(`${this.apiUrl}`, createContactoDto);
  }

  fetchByEmpresa(ownerId: number | string, ownerType: 'persona' | 'empresa') {
    return this.http.get<any>( `${this.apiUrl}/by-owner/${ownerId}?ownerType=${ownerType}`);
  }

  fetchByOwner(ownerId: Signal<number | string>, ownerType: 'persona' | 'empresa') {
    return httpResource<any>(() => ({
      url: `${this.apiUrl}/by-owner/${ownerId()}?ownerType=${ownerType}`,
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<any>(() => ({
      url: `${this.apiUrl}/${id}`,
    }), { defaultValue: null });
  }

  update(id: number, updateContactoDto: any) {
    return this.http.patch(`${this.apiUrl}/${id}`, updateContactoDto);
  }

  remove(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  crearContactoDialogo(ownerId: number, ownerType: 'persona' | 'empresa') {
    return this.dialogService.open(CrearContactoDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Crear Contacto',
      width: '600px',
      breakpoints: {
        '600px': '95%',
      },
      data: { ownerId, ownerType }
    });
  }

  editarContactoDialogo(id: number) {
    return this.dialogService.open(EditarContactoDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar Contacto',
      width: '600px',
      breakpoints: {
        '600px': '95%',
      },
      data: id
    });
  }

}
