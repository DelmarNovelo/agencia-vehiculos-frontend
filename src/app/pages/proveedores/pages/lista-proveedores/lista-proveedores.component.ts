import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';

@Component({
  selector: 'app-lista-proveedores',
  imports: [
    BasicSearchFormComponent,
    TableTitleComponent,
    EmptyMessageComponent,
    TableModule,
    Button,
  ],
  templateUrl: './lista-proveedores.component.html',
  styles: ``
})
export default class ListaProveedoresComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();
  
  private router = inject(Router);
  private proveedorService = inject(ProveedorService);

  searchTerm = signal('');

  proveedores = this.proveedorService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  crearProveedorDialogo() {
    this.router.navigate(['/panel/proveedores/crear']);
  }

  detallesProveedorDialogo(proveedorId: number) {
    this.router.navigate(['/panel/proveedores/detalles', proveedorId]);
  }

  removeProveedor(proveedorId: number) {
    this.proveedorService.remove(proveedorId.toString()).subscribe(() => this.proveedores.reload());
  }
  
}
