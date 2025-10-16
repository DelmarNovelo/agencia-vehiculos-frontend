import { Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { DatePipe, CurrencyPipe, NgFor, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { ContactoService } from '../../../contactos/services/contacto.service';
import { DireccionService } from '../../../direcciones/services/direccion.service';

@Component({
  selector: 'app-detalles-usuario',
  imports: [
    DatePipe,
    CurrencyPipe,
    NgFor,
    Button,
    CommonModule,
  ],
  templateUrl: './detalles-usuario.component.html',
  styles: ``
})
export default class DetallesUsuarioComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private direccionService = inject(DireccionService);
  private contactoService = inject(ContactoService);

  id = input<string>('');
  runningTask = signal(false);

  detallesUsuario = this.usuarioService.fetchOne(this.id);
  contactos = signal<any[]>([]);

  constructor() {
    effect(() => {
      if (this.detallesUsuario.value()) {
        this.fetchContactos();
      }
    });
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editarUsuario() {
    const dialogRef = this.usuarioService.editarUsuarioDialogo(Number(this.id()));
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.detallesUsuario.reload());
  }

  eliminarUsuario() {
    this.runningTask.set(true);
    this.usuarioService.remove(Number(this.id())).subscribe({
      next: () => this.router.navigate(['/panel/usuarios']),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  editarDireccion() {
    const dialogRef = this.direccionService.editarDireccionDialogo(this.detallesUsuario.value().direccion.id);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.detallesUsuario.reload());
  }

  fetchContactos() {
    this.contactoService.fetchByEmpresa(this.detallesUsuario.value()?.persona.id!, 'persona').subscribe({
      next: contactos => this.contactos.set(contactos),
    });
  }

  agregarContacto() {
    const dialogRef = this.contactoService.crearContactoDialogo(this.detallesUsuario.value()?.id, 'persona');
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.fetchContactos());
  }

  editarContacto(contactoId: number) {
    const dialogRef = this.contactoService.editarContactoDialogo(contactoId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.fetchContactos());
  }

  eliminarContacto(contactoId: number) {
    this.contactoService.remove(contactoId)
      .subscribe(() => this.fetchContactos());
  }

}
