import { Component, inject, input, OnDestroy, signal } from '@angular/core';
import { VehiculoService } from '../../services/vehiculo.service';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Button } from 'primeng/button';
import { UnidadVehicularService } from '../../../unidades-vehiculares/services/unidad-vehicular.service';
import { PropertyComponent } from '../../../../shared/components/property/property.component';
import { VehiculoDialogoService } from '../../services/vehiculo-dialogo.service';
import { Subject, takeUntil } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { PrecioVentaDialogoService } from '../../../precios-venta/services/precio-venta-dialogo.service';
import { UnidadVehicularDialogoService } from '../../../unidades-vehiculares/services/unidad-vehicular-dialogo.service';

@Component({
  selector: 'app-detalles-vehiculo',
  imports: [
    CurrencyPipe,
    PropertyComponent,
    Card,
    Skeleton,
    Button
  ],
  templateUrl: './detalles-vehiculo.component.html',
  styles: ``
})
export default class DetallesVehiculoComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private router = inject(Router);
  private vehiculoService = inject(VehiculoService);
  private vehiculoDialogoService = inject(VehiculoDialogoService);
  private precioVentaDialogoService = inject(PrecioVentaDialogoService);
  private unidadVehicularService = inject(UnidadVehicularService);
  private unidadVehicularDialogoService = inject(UnidadVehicularDialogoService);

  id = input('');
  runingTask = signal(false);

  detallesVehiculo = this.vehiculoService.fetchOneDetail(this.id);
  unidadesVehiculares = this.unidadVehicularService.fetchAllByVehicle(this.id);

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editarVehiculoDialogo() {
    const dialogRef = this.vehiculoDialogoService.editarVehiculoDialogo(this.id());
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(success => success && this.detallesVehiculo.reload());
  }

  eliminarVehiculo() {
    this.runingTask.set(true);

    this.vehiculoService.remove(this.id()).subscribe({
      next: () => this.router.navigate(['/panel/vehiculos/lista']),
      error: () => this.runingTask.set(false),
      complete: () => this.runingTask.set(false),
    });
  }

  nuevoPrecioVenta() {
    const dialogRef = this.precioVentaDialogoService.crearPrecioVentaDialogo(this.detallesVehiculo.value()!.id);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => result && this.detallesVehiculo.reload());
  }

  editarPrecioVenta() {
    const dialogRef = this.precioVentaDialogoService.editarPrecioVentaDialogo(this.detallesVehiculo.value()!.precioVentaId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => result && this.detallesVehiculo.reload());
  }

  crearUnidadVehicularDialogo() {
    const dialogRef = this.unidadVehicularDialogoService.crearUnidadVehicularDialogo(this.detallesVehiculo.value()!.id);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => result && this.unidadesVehiculares.reload());
  }

  editarUnidadVehicular(unidadId: number) {
    const dialogRef = this.unidadVehicularDialogoService.editarUnidadVehicularDialogo(unidadId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => result && this.unidadesVehiculares.reload());
  }

  eliminarUnidadVehicular(unidadId: number) {
    this.unidadVehicularService.removeUnidadVehicular(unidadId).subscribe({
      next: () => this.unidadesVehiculares.reload(),
      error: () => this.runingTask.set(false),
      complete: () => this.runingTask.set(false),
    });
  }

}
