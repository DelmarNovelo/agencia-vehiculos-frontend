import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { DireccionService } from '../../../direcciones/services/direccion.service';
import { ContactoService } from '../../../contactos/services/contacto.service';

@Component({
  selector: 'app-detalles-empresa',
  imports: [
    CommonModule,
    CurrencyPipe,
    Button,
  ],
  templateUrl: './detalles-empresa.component.html',
  styles: ``
})
export default class DetallesEmpresaComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private empresaService = inject(EmpresaService);
  private contactoService = inject(ContactoService);
  private direccionService = inject(DireccionService);

  detallesEmpresa = this.empresaService.fetchDetails();
  contactos = signal<any[]>([]);

  constructor() {
    effect(() => {
      if (this.detallesEmpresa.value()) {
        this.fetchContactos();
      }
    });
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editarEmpresa() {
    const dialogRef = this.empresaService.editarEmpresaDialogo(this.detallesEmpresa.value()?.empresa!);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.detallesEmpresa.reload());
  }

  editarDireccion() {
    const dialogRef = this.direccionService.editarDireccionDialogo(this.detallesEmpresa.value()?.direccion.id!);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.detallesEmpresa.reload());
  }

  fetchContactos() {
    this.contactoService.fetchByEmpresa(this.detallesEmpresa.value()?.empresa.id!, 'empresa').subscribe({
      next: contactos => this.contactos.set(contactos),
    });
  }

  agregarContacto() {
    const dialogRef = this.contactoService.crearContactoDialogo(this.detallesEmpresa.value()?.empresa.id!, 'empresa');
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
