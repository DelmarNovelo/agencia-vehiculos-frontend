import { Component, inject, signal } from '@angular/core';
import { MarcaService } from '../../services/marca.service';
import { Subject, takeUntil } from 'rxjs';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';

@Component({
  selector: 'app-lista-marcas',
  imports: [
    BasicSearchFormComponent,
    TableTitleComponent,
    EmptyMessageComponent,
    TableModule,
    Button,
  ],
  templateUrl: './lista-marcas.component.html',
  styles: ``
})
export default class ListaMarcasComponent {

  private unsubscribe$ = new Subject<void>();

  private marcaService = inject(MarcaService);

  searchTerm = signal('');

  marcas = this.marcaService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevaMarcaDialogo() {
    const dialogRef = this.marcaService.nuevaMarcaDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.marcas.reload());
  }

  editarMarcaDialogo(marcaId: number) {
    const dialogRef = this.marcaService.editarMarcaDialogo(marcaId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.marcas.reload());
  }

  removeMarca(marcaId: number) {
    this.marcaService.remove(marcaId).subscribe(() => this.marcas.reload());
  }

}
