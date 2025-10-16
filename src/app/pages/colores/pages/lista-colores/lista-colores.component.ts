import { Component, inject, OnDestroy, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ColorService } from '../../services/color.service';
import { Button } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';

@Component({
  selector: 'app-lista-colores',
  imports: [
    BasicSearchFormComponent,
    EmptyMessageComponent,
    TableTitleComponent,
    TableModule,
    Button,
  ],
  templateUrl: './lista-colores.component.html',
  styles: ``
})
export default class ListaColoresComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private colorService = inject(ColorService);

  searchTerm = signal('');

  colores = this.colorService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevoColorDialogo() {
    const dialogRef = this.colorService.nuevoColorDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.colores.reload());
  }

  editarColorDialogo(colorId: number) {
    const dialogRef = this.colorService.editarColorDialogo(colorId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.colores.reload());
  }

  removeColor(colorId: number) {
    this.colorService.remove(colorId).subscribe(() => this.colores.reload());
  }

}
