import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ResumenEmpresa } from '../dto/resumen-empresa.dto';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarEmpresaDialogoComponent } from '../dialogos/editar-empresa-dialogo/editar-empresa-dialogo.component';
import { PRIMENG_DIALOG_CONFIG } from '../../../common/const/primeng-configs';
import { EmpresaDto } from '../dto/empresa.dto';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private http = inject(HttpClient);
  private dialogService = inject(DialogService);
  
  private apiUrl = `${environment.apiUrl}/empresas`;

  fetchDetails() {
    return httpResource<ResumenEmpresa | null>(() => ({
      url: this.apiUrl,
    }), { defaultValue: null })
  }

  update(id: number, updateEmpresaDto: any) {
    return this.http.patch(`${this.apiUrl}/${id}`, updateEmpresaDto);
  }
  
  editarEmpresaDialogo(empresa: EmpresaDto) {
    return this.dialogService.open(EditarEmpresaDialogoComponent, {
      ...PRIMENG_DIALOG_CONFIG,
      header: 'Editar Empresa',
      width: '600px',
      breakpoints: {
        '600px': '95%',
      },
      data: empresa
    })
  }
  
}
