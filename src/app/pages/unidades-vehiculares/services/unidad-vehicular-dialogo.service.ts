import { inject, Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CrearUnidadVehicularComponent } from '../dialogos/crear-unidad-vehicular/crear-unidad-vehicular.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { EditarUnidadVehicularComponent } from '../dialogos/editar-unidad-vehicular/editar-unidad-vehicular.component';

@Injectable({
  providedIn: 'root'
})
export class UnidadVehicularDialogoService {

  private dialogService = inject(DialogService);

  crearUnidadVehicularDialogo(vehiculoId: number) {
    return this.dialogService.open(CrearUnidadVehicularComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Registrar unidad vehicular',
      width: '600px',
      breakpoints: {
        '600px': '95%',
      },
      data: vehiculoId
    });
  }

  editarUnidadVehicularDialogo(unidadVehicularId: number) {
    return this.dialogService.open(EditarUnidadVehicularComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar unidad vehicular',
      width: '600px',
      breakpoints: {
        '600px': '95%',
      },
      data: unidadVehicularId
    });
  }

}
