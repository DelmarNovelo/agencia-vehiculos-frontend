import { Component, inject, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { SearchAutocompleteComponent } from '../../../../shared/components/search-autocomplete/search-autocomplete.component';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { BasicSearchFormComponent } from '../../../../shared/components/basic-search-form/basic-search-form.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';
import { TableTitleComponent } from '../../../../shared/components/table-title/table-title.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-usuarios',
  imports: [
    RouterLink,
    BasicSearchFormComponent,
    TableTitleComponent,
    EmptyMessageComponent,
    TableModule,
    Button,
  ],
  templateUrl: './lista-usuarios.component.html',
  styles: ``
})
export default class ListaUsuariosComponent {

  private unsubscribe$ = new Subject<void>();

  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  searchTerm = signal('');

  usuarios = this.usuarioService.fetchAll(this.searchTerm);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevoUsuario() {
    this.router.navigate(['/panel/usuarios/crear']);
  }

  editarUsuario(usuarioId: number) {
    // const dialogRef = this.usuarioService.editarUsuarioDialogo(usuarioId);
    // dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(() => this.usuarios.reload());
  }

  removeUsuario(usuarioId: number) {
    this.usuarioService.remove(usuarioId).subscribe(() => this.usuarios.reload());
  }

}
