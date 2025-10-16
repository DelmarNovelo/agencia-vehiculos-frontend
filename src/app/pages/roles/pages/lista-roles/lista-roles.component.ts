import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RolService } from '../../services/rol.service';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';
import { RolDto } from '../../dto/rol.dto';

@Component({
  selector: 'app-lista-roles',
  imports: [
    BasicSearchFormComponent,
    TableTitleComponent,
    EmptyMessageComponent,
    TableModule,
    Button,
  ],
  templateUrl: './lista-roles.component.html',
  styles: ``
})
export default class ListaRolesComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private rolService = inject(RolService);

  searchTerm = signal('');

  roles = this.rolService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevoRolDialogo() {
    const dialogRef = this.rolService.nuevoRolDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => response && this.roles.reload());
  }

  editarRolDialogo(rol: RolDto) {
    const dialogRef = this.rolService.editarRolDialogo(rol.id);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => response && this.roles.reload());
  }

  removeRol(rol: RolDto) {
    if (!rol.canBeDeleted) {
      alert('Este rol no puede ser eliminado porque es un rol predeterminado del sistema')
      return;
    }

    this.rolService.remove(rol.id).subscribe(() => this.roles.reload());
  }

}
