import { Component, inject, OnDestroy, signal } from '@angular/core';
import { TransmisionService } from '../../services/transmision.service';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';

@Component({
  selector: 'app-lista-transmisiones',
  imports: [
    BasicSearchFormComponent,
    TableTitleComponent,
    EmptyMessageComponent,
    TableModule,
    Button,
  ],
  templateUrl: './lista-transmisiones.component.html',
  styles: ``
})
export default class ListaTransmisionesComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private transmisionService = inject(TransmisionService);

  searchTerm = signal('');

  transmisiones = this.transmisionService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevaTransmisionDialogo() {
    const dialogRef = this.transmisionService.nuevaTransmisionDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.transmisiones.reload());
  }

  editarTransmisionDialogo(transmisionId: number) {
    const dialogRef = this.transmisionService.editarTransmisionDialogo(transmisionId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.transmisiones.reload());
  }

  removeTransmision(transmisionId: number) {
    this.transmisionService.remove(transmisionId).subscribe(() => this.transmisiones.reload());
  }

}
