import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { EditarUsuarioDialogoComponent } from '../dialogos/editar-usuario-dialogo/editar-usuario-dialogo.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/usuarios`;

  create(data: any) {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<any[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`,
    }), { defaultValue: [] });
  }

  fetchOne(id: Signal<string>) {
    return httpResource<any>(() => ({
      url: `${this.apiUrl}/${id()}`,
    }), { defaultValue: null });
  }

  fetchOneDetails(id: number) {
    return httpResource<any | null>(() => ({
      url: `${this.apiUrl}/${id}/detalles`
    }), { defaultValue: null });
  }

  update(id: number, updateUsuarioDto: any) {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, updateUsuarioDto);
  }

  remove(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  editarUsuarioDialogo(usuarioId: number) {
    return this.dialogService.open(EditarUsuarioDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar usuario',
      width: '700px',
      breakpoints: {
        '700px': '95%'
      },
      data: usuarioId
    })
  }

}
