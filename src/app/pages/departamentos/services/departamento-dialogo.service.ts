import { inject, Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CrearDepartamentoComponent } from '../dialogos/crear-departamento/crear-departamento.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { EditarDepartamentoComponent } from '../dialogos/editar-departamento/editar-departamento.component';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoDialogoService {

  private dialogService = inject(DialogService);

  crearDepartamentoDialogo() {
    return this.dialogService.open(CrearDepartamentoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Nuevo Departamento',
      width: '600px',
      breakpoints: {
        '600px': '95%',
      }
    });
  }

  editarDepartamentoDialogo(departamentoId: number) {
    return this.dialogService.open(EditarDepartamentoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar Departamento',
      width: '600px',
      breakpoints: {
        '600px': '95%',
      },
      data: departamentoId,
    });
  }
}
