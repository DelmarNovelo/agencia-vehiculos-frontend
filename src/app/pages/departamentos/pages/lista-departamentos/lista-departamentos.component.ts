import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { DepartamentoService } from '../../services/departamento.service';
import { Subject, takeUntil } from 'rxjs';
import { DepartamentoDialogoService } from '../../services/departamento-dialogo.service';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';

@Component({
  selector: 'app-lista-departamentos',
  imports: [
    BasicSearchFormComponent,
    EmptyMessageComponent,
    TableTitleComponent,
    TableModule,
    Button,
    Card,
  ],
  templateUrl: './lista-departamentos.component.html',
  styles: ``
})
export default class ListaDepartamentosComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private departamentoService = inject(DepartamentoService);
  private departamentoDialogoService = inject(DepartamentoDialogoService);

  searchTerm = signal('');

  departamentoes = this.departamentoService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  crearDepartamentoDialogo() {
    const dialogRef = this.departamentoDialogoService.crearDepartamentoDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.departamentoes.reload());
  }

  editarDepartamentoDialogo(departamentoId: number) {
    const dialogRef = this.departamentoDialogoService.editarDepartamentoDialogo(departamentoId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.departamentoes.reload());
  }

  removeDepartamento(departamentoId: number) {
    this.departamentoService.remove(departamentoId).subscribe(() => this.departamentoes.reload());
  }

}
