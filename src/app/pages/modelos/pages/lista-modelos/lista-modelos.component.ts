import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ModeloService } from '../../services/modelo.service';
import { Subject, takeUntil } from 'rxjs';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';

@Component({
  selector: 'app-lista-modelos',
  imports: [
    BasicSearchFormComponent,
    TableTitleComponent,
    EmptyMessageComponent,
    TableModule,
    Button,
  ],
  templateUrl: './lista-modelos.component.html',
  styles: ``
})
export default class ListaModelosComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private modeloService = inject(ModeloService);

  searchTerm = signal('');

  modelos = this.modeloService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevoModeloDialogo() {
    const dialogRef = this.modeloService.nuevoModeloDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.modelos.reload());
  }

  editarModeloDialogo(colorId: number) {
    const dialogRef = this.modeloService.editarModeloDialogo(colorId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.modelos.reload());
  }

  removeModelo(colorId: number) {
    this.modeloService.remove(colorId).subscribe(() => this.modelos.reload());
  }

}
