import { inject, Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { EditarVehiculoDialogoComponent } from '../dialogos/editar-vehiculo-dialogo/editar-vehiculo-dialogo.component';

@Injectable({
  providedIn: 'root'
})
export class VehiculoDialogoService {

  private dialogService = inject(DialogService);

  editarVehiculoDialogo(vehiculoId: string) {
    return this.dialogService.open(EditarVehiculoDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar Vehículo',
      width: '800px',
      breakpoints: {
        '800px': '95%'
      },
      data: vehiculoId
    });
  }

}
