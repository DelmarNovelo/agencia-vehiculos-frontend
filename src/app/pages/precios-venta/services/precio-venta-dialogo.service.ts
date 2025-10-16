import { inject, Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarPrecioVentaComponent } from '../dialogos/editar-precio-venta/editar-precio-venta.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { CrearPrecioVentaComponent } from '../dialogos/crear-precio-venta/crear-precio-venta.component';

@Injectable({
  providedIn: 'root'
})
export class PrecioVentaDialogoService {

  private dialogService = inject(DialogService);

  crearPrecioVentaDialogo(vehiculoId: number) {
    return this.dialogService.open(CrearPrecioVentaComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nueva Precio de Venta',
      focusOnShow: false,
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: vehiculoId
    });
  }
  
  editarPrecioVentaDialogo(precioVentaId: number) {
    return this.dialogService.open(EditarPrecioVentaComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar Precio de Venta',
      width: '600px',
      breakpoints: {
        '600px': '95%'
      },
      data: precioVentaId
    })
  }
}
