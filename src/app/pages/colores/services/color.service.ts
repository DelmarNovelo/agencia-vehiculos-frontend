import { inject, Injectable, Signal } from '@angular/core';
import { ColorForSelectDto } from '../dto/color-for-select.dto';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, httpResource } from '@angular/common/http';
import { DialogService } from 'primeng/dynamicdialog';
import { CrearColorComponent } from '../dialogos/crear-color/crear-color.component';
import { CrearColorDto } from '../dto/crear-color.dto';
import { ColorListDto } from '../dto/color-list.dto';
import { EditarColorComponent } from '../dialogos/editar-color/editar-color.component';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private apiUrl = `${environment.apiUrl}/colores`;

  create(crearColorDto: CrearColorDto) {
    return this.http.post<ColorForSelectDto>(`${this.apiUrl}`, crearColorDto);
  }

  fetchAll(searchTerm: Signal<string>) {
    return httpResource<ColorListDto[]>(() => ({
      url: `${this.apiUrl}?searchTerm=${searchTerm()}`
    }), { defaultValue: [] });
  }

  fetchAllForSelect() {
    return httpResource<ColorForSelectDto[]>(() => ({
      url: `${this.apiUrl}/for-select`
    }), { defaultValue: [] });
  }

  fetchOne(id: number) {
    return httpResource<ColorForSelectDto | null>(() => ({
      url: `${this.apiUrl}/${id}`
    }), { defaultValue: null });
  }

  update(id: number, updateColorDto: CrearColorDto) {
    return this.http.patch<ColorForSelectDto>(`${this.apiUrl}/${id}`, updateColorDto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  nuevoColorDialogo() {
    return this.dialogService.open(CrearColorComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nuevo color',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      }
    });
  }

  editarColorDialogo(colorId: number) {
    return this.dialogService.open(EditarColorComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar color',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: { colorId }
    });
  }

}
