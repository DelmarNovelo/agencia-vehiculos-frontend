import { Component, inject, input, OnDestroy, signal } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';
import { DatePipe, CurrencyPipe, NgFor, CommonModule, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { DireccionService } from '../../../direcciones/services/direccion.service';
import { Subject, takeUntil } from 'rxjs';
import { ContactoProveedorService } from '../../../contactos-proveedor/services/contacto-proveedor.service';
import { ContactoService } from '../../../contactos/services/contacto.service';
import { Router } from '@angular/router';
import { CompraService } from '../../../compras/services/compra.service';

@Component({
  selector: 'app-detalles-proveedor',
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    CurrencyPipe,
    NgFor,
    LoadingComponent,
    Button,
  ],
  templateUrl: './detalles-proveedor.component.html',
  styles: ``
})
export default class DetallesProveedorComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private router = inject(Router);
  private proveedorService = inject(ProveedorService);
  private compraService = inject(CompraService);
  private contactoProveedorService = inject(ContactoProveedorService);
  private contactoService = inject(ContactoService);
  private direccionService = inject(DireccionService);

  runningTask = signal(false);
  deleting = signal(false);
  id = input<string>('');

  detallesProveedor = this.proveedorService.fetchOne(this.id);
  comprasProveedor = this.compraService.fetchByProveedor(this.id);
  contactosProveedor = this.contactoProveedorService.fetchAllByProveedor(this.id);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editarProveedor() {
    const dialogData = {
      id: this.detallesProveedor.value()?.id!,
      razonSocial: this.detallesProveedor.value()?.razonSocial!,
      nit: this.detallesProveedor.value()?.nit
    }

    const dialogRef = this.proveedorService.editarProveedorDialogo(dialogData);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.detallesProveedor.reload());
  }

  eliminarProveedor() {
    this.proveedorService.remove(this.id()).subscribe({
      next: () => this.router.navigate(['/panel/proveedores/lista']),
      error: () => this.deleting.set(false),
      complete: () => this.deleting.set(false)
    });
  }

  editarDireccion() {
    const dialogRef = this.direccionService.editarDireccionDialogo(this.detallesProveedor?.value()!.direccion.id);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.detallesProveedor.reload());
  }

  crearContactoProveedor() {
    const dialogRef = this.contactoProveedorService.crearContactoProveedorDialogo(this.detallesProveedor.value()?.id!);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.contactosProveedor.reload());
  }

  editarContactoProveedor(contactoProveedorId: number) {
    const dialogRef = this.contactoProveedorService.editarContactoProveedorDialogo(contactoProveedorId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.contactosProveedor.reload());
  }

  eliminarContactoProveedor(contactoId: number) {
    this.contactoProveedorService.remove(contactoId)
      .subscribe(() => this.contactosProveedor.reload());
  }

  agregarContacto(personaId: number) {
    const dialogRef = this.contactoService.crearContactoDialogo(personaId, 'persona');
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.contactosProveedor.reload());
  }

  editarContacto(contactoId: number) {
    const dialogRef = this.contactoService.editarContactoDialogo(contactoId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.contactosProveedor.reload());
  }

  eliminarContacto(contactoId: number) {
    this.contactoService.remove(contactoId)
      .subscribe(() => this.contactosProveedor.reload());
  }

}
