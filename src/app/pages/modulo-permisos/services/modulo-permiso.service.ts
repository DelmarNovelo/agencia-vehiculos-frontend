import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModuloPermisoService {

  private apiUrl = `${environment.apiUrl}/modulo-permisos`;

  fetchAll() {
    return httpResource<any[]>(() => ({
      url: this.apiUrl,
    }), { defaultValue: [] });
  }
}
