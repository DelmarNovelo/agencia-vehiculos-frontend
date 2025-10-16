import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CombustibleService } from '../../services/combustible.service';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';

@Component({
  selector: 'app-lista-combustibles',
  imports: [
    BasicSearchFormComponent,
    TableTitleComponent,
    EmptyMessageComponent,
    TableModule,
    Button,
  ],
  templateUrl: './lista-combustibles.component.html',
  styles: ``
})
export default class ListaCombustiblesComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private combustibleService = inject(CombustibleService);

  searchTerm = signal('');

  combustibles = this.combustibleService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevoCombustibleDialogo() {
    const dialogRef = this.combustibleService.nuevoCombustibleDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.combustibles.reload());
  }

  editarCombustibleDialogo(colorId: number) {
    const dialogRef = this.combustibleService.editarCombustibleDialogo(colorId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.combustibles.reload());
  }

  removeCombustible(colorId: number) {
    this.combustibleService.remove(colorId).subscribe(() => this.combustibles.reload());
  }

}
