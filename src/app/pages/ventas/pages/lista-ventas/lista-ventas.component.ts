import { Component, inject, signal } from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';

@Component({
  selector: 'app-lista-ventas',
  imports: [
    DatePipe,
    BasicSearchFormComponent,
    EmptyMessageComponent,
    TableTitleComponent,
    CurrencyPipe,
    TableModule,
    Button,
    RouterModule,
  ],
  templateUrl: './lista-ventas.component.html',
  styles: ``
})
export default class ListaVentasComponent {

  private router = inject(Router);
  private ventaService = inject(VentaService);

  searchTerm = signal<string>('');

  ventas = this.ventaService.fetchAll(this.searchTerm);

  nuevaVenta() {
    this.router.navigate(['/panel/ventas/nueva']);
  }
  
}
