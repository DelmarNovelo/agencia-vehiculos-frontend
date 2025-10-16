import { Component, inject, signal } from '@angular/core';
import { VehiculoService } from '../../services/vehiculo.service';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { NgIf } from '@angular/common';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { Router, RouterLink } from '@angular/router';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';

@Component({
  selector: 'app-lista-vehiculos',
  imports: [
    NgIf,
    RouterLink,
    TableModule,
    Button,
    EmptyMessageComponent,
    BasicSearchFormComponent,
    TableTitleComponent,
  ],
  templateUrl: './lista-vehiculos.component.html',
  styles: ``
})
export default class ListaVehiculosComponent {

  private router = inject(Router);
  private vehiculoService = inject(VehiculoService);

  searchTerm = signal<string>('');
  
  vehiculos = this.vehiculoService.fetchAll(this.searchTerm);

  nuevoVehiculo() {
    this.router.navigate(['/panel/vehiculos/nuevo']);
  }
  
  removeVehiculo(vehiculoId: number) {
    this.vehiculoService.remove(vehiculoId.toString()).subscribe({
      next: () => this.vehiculos.reload(),
    });
  }
}
