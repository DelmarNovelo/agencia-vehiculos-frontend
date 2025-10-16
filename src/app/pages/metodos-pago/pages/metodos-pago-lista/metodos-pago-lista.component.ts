import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MetodoPagoService } from '../../services/metodo-pago.service';
import { Subject, takeUntil } from 'rxjs';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';

@Component({
  selector: 'app-metodos-pago-lista',
  imports: [
    BasicSearchFormComponent,
    TableTitleComponent,
    EmptyMessageComponent,
    TableModule,
    Button,
  ],
  templateUrl: './metodos-pago-lista.component.html',
  styles: ``
})
export default class MetodosPagoListaComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private metodoPagoService = inject(MetodoPagoService);

  searchTerm = signal('');

  metodoPagos = this.metodoPagoService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevoMetodoPagoDialogo() {
    const dialogRef = this.metodoPagoService.nuevoMetodoPagoDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.metodoPagos.reload());
  }

  editarMetodoPagoDialogo(metodoPagoId: number) {
    const dialogRef = this.metodoPagoService.editarMetodoPagoDialogo(metodoPagoId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.metodoPagos.reload());
  }

  removeMetodoPago(metodoPagoId: number) {
    this.metodoPagoService.remove(metodoPagoId).subscribe(() => this.metodoPagos.reload());
  }

}
