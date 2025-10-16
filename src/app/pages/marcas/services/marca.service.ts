import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { MarcaForSelectDto } from '../dto/marca-for-select.dto';
import { DialogService } from 'primeng/dynamicdialog';
import { NuevaMarcaComponent } from '../dialogos/nueva-marca/nueva-marca.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { CrearMarcaDto } from '../dto/crear-marca.dto';
import { MarcaResponseDto } from '../dto/marca-response.dto';
import { Marca } from '../interfaces/marca.interface';
import { EditarMarcaDialogoComponent } from '../dialogos/editar-marca-dialogo/editar-marca-dialogo.component';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/marcas`;

  crearMarca(crearMarcaDto: CrearMarcaDto) {
    return this.http.post<MarcaResponseDto>(`${this.apiUrl}/`, crearMarcaDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<Marca[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`,
    }), { defaultValue: [] });
  }

  findAllForSelect() {
    return httpResource<MarcaForSelectDto[]>(() => ({
      url: `${this.apiUrl}/for-select`,
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<Marca | null>(() => ({
      url: `${this.apiUrl}/${id}`,
    }), { defaultValue: null });
  }

  update(id: number, updateMarcaDto: { nombre: string }) {
    return this.http.patch<MarcaResponseDto>(`${this.apiUrl}/${id}`, updateMarcaDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  nuevaMarcaDialogo() {
    return this.dialogService.open(NuevaMarcaComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nueva marca',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      }
    });
  }

  editarMarcaDialogo(marcaId: number) {
    return this.dialogService.open(EditarMarcaDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar marca',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: marcaId
    });
  }

}
