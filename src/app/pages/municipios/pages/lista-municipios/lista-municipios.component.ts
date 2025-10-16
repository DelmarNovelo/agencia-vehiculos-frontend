import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MunicipioService } from '../../services/municipio.service';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';

@Component({
  selector: 'app-lista-municipios',
  imports: [
    BasicSearchFormComponent,
    TableTitleComponent,
    EmptyMessageComponent,
    TableModule,
    Button,
  ],
  templateUrl: './lista-municipios.component.html',
  styles: ``
})
export default class ListaMunicipiosComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private municipioService = inject(MunicipioService);

  searchTerm = signal('');

  municipios = this.municipioService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  crearMunicipioDialogo() {
    const dialogRef = this.municipioService.crearMunicipioDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => res && this.municipios.reload());
  }

  editarMunicipioDialogo(municipioId: number) {
    const dialogRef = this.municipioService.editarMunicipioDialogo(municipioId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.municipios.reload());
  }

  removeMunicipio(municipioId: number) {
    this.municipioService.remove(municipioId).subscribe(() => this.municipios.reload());
  }

}
