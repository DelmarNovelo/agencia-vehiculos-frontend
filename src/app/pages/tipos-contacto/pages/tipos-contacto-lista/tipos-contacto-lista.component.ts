import { Component, inject, OnDestroy, signal } from '@angular/core';
import { TipoContactoService } from '../../services/tipo-contacto.service';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';

@Component({
  selector: 'app-tipos-contacto-lista',
  imports: [
    BasicSearchFormComponent,
    TableTitleComponent,
    EmptyMessageComponent,
    TableModule,
    Button,
  ],
  templateUrl: './tipos-contacto-lista.component.html',
  styles: ``
})
export default class TiposContactoListaComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private tipoContactoService = inject(TipoContactoService);

  searchTerm = signal('');

  tipoContactos = this.tipoContactoService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevoTipoContactoDialogo() {
    const dialogRef = this.tipoContactoService.nuevoTipoContactoDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.tipoContactos.reload());
  }

  editarTipoContactoDialogo(tipoContactoId: number) {
    const dialogRef = this.tipoContactoService.editarTipoContactoDialogo(tipoContactoId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.tipoContactos.reload());
  }

  removeTipoContacto(tipoContactoId: number) {
    this.tipoContactoService.remove(tipoContactoId).subscribe(() => this.tipoContactos.reload());
  }

}
