import { Component, inject, signal } from '@angular/core';
import { CompraService } from '../../services/compra.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';

@Component({
  selector: 'app-lista-compras',
  imports: [
    DatePipe,
    CurrencyPipe,
    BasicSearchFormComponent,
    TableModule,
    Button,
    RouterModule,
    EmptyMessageComponent,
    TableTitleComponent,
  ],
  templateUrl: './lista-compras.component.html',
  styles: ``
})
export default class ListaComprasComponent {

  private router = inject(Router);
  private compraService = inject(CompraService);

  searchTerm = signal<string>('');

  compras = this.compraService.fetchAll(this.searchTerm);

  nuevaCompra() {
    this.router.navigate(['/panel/compras/nueva']);
  }
  
}
