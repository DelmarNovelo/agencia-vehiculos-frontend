import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';
import { LineaService } from '../../services/linea.service';

@Component({
  selector: 'app-lista-lineas',
  imports: [
    BasicSearchFormComponent,
    TableTitleComponent,
    EmptyMessageComponent,
    TableModule,
    Button,
  ],
  templateUrl: './lista-lineas.component.html',
  styles: ``
})
export default class ListaLineasComponent {

  private unsubscribe$ = new Subject<void>();

  private lineaService = inject(LineaService);

  searchTerm = signal('');

  lineas = this.lineaService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevaLineaDialogo() {
    const dialogRef = this.lineaService.nuevaLineaDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.lineas.reload());
  }

  editarLineaDialogo(lineaId: number) {
    const dialogRef = this.lineaService.editarLineaDialogo(lineaId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.lineas.reload());
  }

  removeLinea(lineaId: number) {
    this.lineaService.remove(lineaId).subscribe(() => this.lineas.reload());
  }

}
