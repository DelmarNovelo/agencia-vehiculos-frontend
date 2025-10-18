import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { VehiculoService } from '../../../vehiculos/services/vehiculo.service';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { MetodoPagoService } from '../../../metodos-pago/services/metodo-pago.service';
import { Select } from 'primeng/select';
import { IftaLabel } from 'primeng/iftalabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { UnidadVehicularService } from '../../../unidades-vehiculares/services/unidad-vehicular.service';
import { VehiculoAutocomplete } from '../../../vehiculos/dto/vehiculo-autocomplete.dto';
import { UnidadVehicular } from '../../../unidades-vehiculares/interfaces/unidad-vehicular.interface';
import { FormsModule, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { TiposVenta } from '../../../../common/enums/tipos-venta.enum';
import { Textarea } from 'primeng/textarea';
import { markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { Router } from '@angular/router';
import { SearchAutocompleteComponent } from '../../../../shared/components/search-autocomplete/search-autocomplete.component';
import { ClienteAutocomplete } from '../../../clientes/dto/cliente-autocomplete.dto';

interface CarritoItem {
  vehiculoId: number;
  unidadId: number;
  nombre: string;
  vin: string;
  precio: number;
}

@Component({
  selector: 'app-nueva-venta',
  imports: [
    CurrencyPipe,
    NgIf,
    NgFor,
    FormsModule,
    Button,
    Card,
    CommonModule,
    DatePipe,
    IftaLabel,
    Select,
    Textarea,
    AutoCompleteModule,
    ReactiveFormsModule,
    SearchAutocompleteComponent,
  ],
  templateUrl: './nueva-venta.component.html',
  styles: ``
})
export default class NuevaVentaComponent {

  fechaActual = new Date();

  private router = inject(Router);
  private formBuilder = inject(NonNullableFormBuilder);
  private clienteService = inject(ClienteService);
  private vehiculoService = inject(VehiculoService);
  private unidadVehicularService = inject(UnidadVehicularService);
  private ventaService = inject(VentaService);
  private metodoPagoService = inject(MetodoPagoService);

  usuarioNombre = JSON.parse(localStorage.getItem('usuario') as string).nombreCompleto;
  clientes = signal<ClienteAutocomplete[]>([]);
  clienteSeleccionado = signal<ClienteAutocomplete | null>(null);
  runningTask = signal(false);

  vehiculos = signal<VehiculoAutocomplete[]>([]);
  vehiculoSeleccionado = signal<VehiculoAutocomplete | null>(null);

  unidades = signal<UnidadVehicular[]>([]);

  metodosPago = this.metodoPagoService.fetchAllForSelect();
  tiposVenta = [TiposVenta.Directa, TiposVenta.Financiada];

  carrito = signal<CarritoItem[]>([]);

  ventaFormGroup = this.formBuilder.group({
    tipoVenta: this.formBuilder.control(TiposVenta.Directa),
    metodoPagoId: this.formBuilder.control(null, [Validators.required]),
    notas: this.formBuilder.control(''),
  });

  unidadesFormGroup = this.formBuilder.group({
    unidades: this.formBuilder.array([]),
  });

  buscarClientes(searchTerm: string) {
    this.clienteService.fetchAllForAutocomplete(searchTerm).subscribe({
      next: response => this.clientes.set(response),
    });
  }

  buscarVehiculos(term: string) {
    this.vehiculoService.fetchForAutocomplete(term).subscribe({
      next: response => this.vehiculos.set(response),
    });
  }

  seleccionarVehiculo(vehiculo: any) {
    this.vehiculoSeleccionado.set(vehiculo);
    this.buscarUnidadesVehiculares(vehiculo.id);
  }

  buscarUnidadesVehiculares(vehiculoId: number) {
    this.unidadVehicularService.fetchAllByVehicleForSale(vehiculoId).subscribe({
      next: response => this.unidades.set(response),
    });
  }

  agregarAlCarrito(unidad: UnidadVehicular) {
    const exists = this.carrito().find(item => item.vin === unidad.vin);
    if (exists) {
      alert('El vehículo ya está en el carrito');
      return;
    }

    const carritoItem: CarritoItem = {
      vehiculoId: this.vehiculoSeleccionado()!.id,
      unidadId: unidad.id,
      vin: unidad.vin,
      nombre: this.vehiculoSeleccionado()!.label,
      precio: this.vehiculoSeleccionado()!.precioVenta
    };

    this.carrito.update(currentValue => [...currentValue, carritoItem]);
    this.insertarUnidad(this.vehiculoSeleccionado()!.id, unidad.id, unidad.vin);
  }

  removerDelCarrito(index: number) {
    this.carrito().splice(index, 1);
    this.eliminarUnidad(index);
  }

  procesarVenta() {
    if (!this.clienteSeleccionado || this.carrito().length === 0) {
      alert('Debe seleccionar un cliente y al menos un vehículo');
      return;
    }

    if (this.unidadesFormGroup.invalid) {
      this.unidadesFormArray.controls.forEach((fg: any) => markFormGroupAsDirty(fg));
      alert('El formulario de venta contiene errores, por favor verifique');
      return;
    }

    if (this.ventaFormGroup.invalid) {
      alert('Seleccione los detalles de la venta');
      markFormGroupAsDirty(this.ventaFormGroup);
      return;
    }

    const ventaData: any = {
      clienteId: this.clienteSeleccionado()!.id,
      ...this.ventaFormGroup.getRawValue(),
      items: this.unidadesFormArray.getRawValue()
    };

    this.runningTask.set(true);

    this.ventaService.registrarVenta(ventaData).subscribe({
      next: (response) => {
        this.ventaFormGroup.reset();
        this.unidadesFormArray.clear();
        this.clienteSeleccionado.set(null);
        this.vehiculoSeleccionado.set(null);
        this.carrito.set([]);
        this.unidades.set([]);
        this.router.navigate(['/panel/ventas/detalles', response.ventaId]);
      },
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  crearUnidadFormGroup(vehiculoId: number, unidadId: number, vin: string) {
    return this.formBuilder.group({
      vehiculoId: this.formBuilder.control(vehiculoId, Validators.required),
      unidadId: this.formBuilder.control(unidadId, Validators.required),
      vin: this.formBuilder.control(vin, Validators.required),
      descuento: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),
    });
  }

  insertarUnidad(vehiculoId: number, unidadId: number, vin: string) {
    this.unidadesFormArray.push(this.crearUnidadFormGroup(vehiculoId, unidadId, vin));
  }

  eliminarUnidad(index: number) {
    this.unidadesFormArray.removeAt(index);
  }

  get unidadesFormArray() {
    return this.unidadesFormGroup.controls.unidades as FormArray;
  }

  detallesItemCarrito(index: number, property: string) {
    return this.carrito()[index][property as keyof CarritoItem];
  }

  get subtotal(): number {
    return this.carrito().reduce((sum, item) => sum + item.precio, 0);
  }

  get total(): number {
    return this.subtotal - this.descuento;
  }

  get descuento(): number {
    return this.unidadesFormArray.getRawValue().reduce((acc, unidad) => (unidad.descuento || 0) + acc, 0);
  }

}
