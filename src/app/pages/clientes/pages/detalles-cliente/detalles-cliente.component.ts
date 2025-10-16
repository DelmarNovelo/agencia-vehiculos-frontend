import { Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Button } from 'primeng/button';
import { CommonModule, CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DireccionService } from '../../../direcciones/services/direccion.service';
import { ContactoService } from '../../../contactos/services/contacto.service';
import { VentaService } from '../../../ventas/services/venta.service';

@Component({
  selector: 'app-detalles-cliente',
  imports: [
    DatePipe,
    CurrencyPipe,
    NgFor,
    Button,
    CommonModule,
  ],
  templateUrl: './detalles-cliente.component.html',
  styles: ``
})
export default class DetallesClienteComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private router = inject(Router);
  private ventaService = inject(VentaService);
  private clienteService = inject(ClienteService);
  private direccionService = inject(DireccionService);
  private contactoService = inject(ContactoService);

  id = input<string>('');
  runningTask = signal(false);

  detallesCliente = this.clienteService.fetchOne(this.id);
  ventasCliente = this.ventaService.fetchByCliente(this.id);
  contactos = signal<any[]>([]);

  constructor() {
    effect(() => {
      if (this.detallesCliente.value()) {
        this.fetchContactos();
      }
    });
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editarCliente() {
    const dialogRef = this.clienteService.editarClienteDialogo(Number(this.id()));
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.detallesCliente.reload());
  }

  eliminarCliente() {
    this.runningTask.set(true);
    this.clienteService.remove(this.id()).subscribe({
      next: () => this.router.navigate(['/panel/clientes']),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  editarDireccion() {
    const dialogRef = this.direccionService.editarDireccionDialogo(this.detallesCliente.value().direccion.id);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.detallesCliente.reload());
  }

  fetchContactos() {
    this.contactoService.fetchByEmpresa(this.detallesCliente.value()?.persona.id!, 'persona').subscribe({
      next: contactos => this.contactos.set(contactos),
    });
  }

  agregarContacto() {
    const dialogRef = this.contactoService.crearContactoDialogo(this.detallesCliente.value()?.id, 'persona');
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
