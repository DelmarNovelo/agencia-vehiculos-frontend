import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';

@Component({
  selector: 'app-lista-clientes',
  imports: [
    BasicSearchFormComponent,
    TableModule,
    TableTitleComponent,
    EmptyMessageComponent,
    Button,
  ],
  templateUrl: './lista-clientes.component.html',
  styles: ``
})
export default class ListaClientesComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();
  
  private router = inject(Router);
  private clienteService = inject(ClienteService);

  searchTerm = signal('');

  clientes = this.clienteService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  crearClienteDialogo() {
    this.router.navigate(['/panel/clientes/crear']);
  }

  detallesClienteDialogo(clienteId: number) {
    this.router.navigate(['/panel/clientes/detalles', clienteId]);
  }

  removeCliente(clienteId: number) {
    this.clienteService.remove(clienteId.toString()).subscribe(() => this.clientes.reload());
  }
  
}
