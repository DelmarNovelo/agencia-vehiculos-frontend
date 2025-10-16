import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { LineaForSelectDto } from '../dto/linea-for-select.dto';
import { CrearLineaComponent } from '../dialogos/crear-linea/crear-linea.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { DialogService } from 'primeng/dynamicdialog';
import { CrearLineaDto } from '../dto/crear-linea.dto';
import { EditarLineaDialogoComponent } from '../dialogos/editar-linea-dialogo/editar-linea-dialogo.component';
import { Linea } from '../interfaces/linea.interface';

@Injectable({
  providedIn: 'root'
})
export class LineaService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/lineas`;

  create(crearLineaDto: CrearLineaDto) {
    return this.http.post<LineaForSelectDto>(`${this.apiUrl}`, crearLineaDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<Linea[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`,
    }), { defaultValue: [] });
  }

  fetchAllForSelect(lineaId: number) {
    return this.http.get<LineaForSelectDto[]>(`${this.apiUrl}/for-select/${lineaId}`);
  }

  fetchOne(id: number) {
    return httpResource<Linea | null>(() => ({
      url: `${this.apiUrl}/${id}`,
    }), { defaultValue: null });
  }

  update(id: number, updateLineaDto: { nombre: string }) {
    return this.http.patch<Linea>(`${this.apiUrl}/${id}`, updateLineaDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  nuevaLineaDialogo(lineaId?: number) {
    return this.dialogService.open(CrearLineaComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nueva linea',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: lineaId
    });
  }

  editarLineaDialogo(lineaId: number) {
    return this.dialogService.open(EditarLineaDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar linea',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: lineaId
    });
  }

}
