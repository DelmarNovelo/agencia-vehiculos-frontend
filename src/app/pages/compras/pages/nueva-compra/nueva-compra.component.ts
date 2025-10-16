import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Card } from 'primeng/card';
import { FormArray, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { SearchAutocompleteComponent } from '../../../../shared/components/search-autocomplete/search-autocomplete.component';
import { ProveedorService } from '../../../proveedores/services/proveedor.service';
import { ProveedorAutocomplete } from '../../../proveedores/dto/proveedor-autocomplete.dto';
import { VehiculoAutocomplete } from '../../../vehiculos/dto/vehiculo-autocomplete.dto';
import { VehiculoService } from '../../../vehiculos/services/vehiculo.service';
import { IftaLabel } from 'primeng/iftalabel';
import { markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { TiposVenta } from '../../../../common/enums/tipos-venta.enum';
import { MetodoPagoService } from '../../../metodos-pago/services/metodo-pago.service';
import { DatePicker } from 'primeng/datepicker';
import { TiposDocumento } from '../../../../common/enums/tipos-documento.enum';
import { CompraService } from '../../services/compra.service';
import { Router } from '@angular/router';

interface ItemCompra {
  vehiculoLabel: string;
  vehiculoId: number;
  vin: string;
  precioCompra: number;
  descuento: number;
}

@Component({
  selector: 'app-nueva-compra',
  imports: [
    ReactiveFormsModule,
    IftaLabel,
    Button,
    DatePipe,
    CurrencyPipe,
    Dialog,
    DatePicker,
    InputText,
    InputNumber,
    Card,
    FormsModule,
    Select,
    Textarea,
    InputNumber,
    SearchAutocompleteComponent,
  ],
  templateUrl: './nueva-compra.component.html',
  styles: ``
})
export default class NuevaCompraComponent {

  fechaActual = new Date();

  private router = inject(Router);
  private formBuilder = inject(NonNullableFormBuilder);
  private compraService = inject(CompraService);
  private proveedorService = inject(ProveedorService);
  private vehiculoService = inject(VehiculoService);
  private metodoPagoService = inject(MetodoPagoService);

  proveedores = signal<ProveedorAutocomplete[]>([]);
  proveedorSeleccionado = signal<ProveedorAutocomplete | null>(null);

  vehiculos = signal<VehiculoAutocomplete[]>([]);
  vehiculoSeleccionado = signal<VehiculoAutocomplete | null>(null);

  metodosPago = this.metodoPagoService.fetchAllForSelect();
  tiposCompra = [TiposVenta.Directa, TiposVenta.Financiada];

  runningTask = signal(false);
  ordenDeCompra = signal<ItemCompra[]>([]);
  tiposDocumento = [TiposDocumento.Factura, TiposDocumento.NotaDeCredito, TiposDocumento.Recibo];

  compraFormGroup = this.formBuilder.group({
    tipoCompra: this.formBuilder.control(TiposVenta.Directa),
    metodoPagoId: this.formBuilder.control(null, [Validators.required]),
    notas: this.formBuilder.control(''),
  });

  unidadesFormGroup = this.formBuilder.group({
    precioCompra: this.formBuilder.control<number | null>(null,
      [Validators.required, Validators.min(0)]),
    unidades: this.formBuilder.array([]),
  });

  documentoFormGroup = this.formBuilder.group({
    numDocumento: this.formBuilder.control('', Validators.required),
    tipoDocumento: this.formBuilder.control(TiposDocumento.Factura, [Validators.required]),
    fechaEmision: this.formBuilder.control(new Date(), Validators.required),
  });

  buscarProveedores(searchTerm: string) {
    this.proveedorService.fetchAllForAutocomplete(searchTerm).subscribe({
      next: response => this.proveedores.set(response),
    });
  }

  buscarVehiculos(term: string) {
    this.vehiculoService.fetchForAutocomplete(term).subscribe({
      next: response => this.vehiculos.set(response),
    });
  }

  seleccionarVehiculo(vehiculo: VehiculoAutocomplete) {
    this.vehiculoSeleccionado.set(vehiculo);
    this.insertarUnidad();
  }

  agregarALaOrdenDeCompra() {
    if (this.unidadesFormGroup.invalid) {
      markFormGroupAsDirty(this.unidadesFormGroup);
      this.unidadesFormArray.controls.forEach((fg: any) => markFormGroupAsDirty(fg));
      return;
    }

    const { precioCompra, unidades } = this.unidadesFormGroup.getRawValue();
    const { id, label } = this.vehiculoSeleccionado()!;

    const itemsCompra: ItemCompra[] = unidades.map((unidad: any) => {
      const { vin, descuento } = unidad;

      return {
        vin,
        precioCompra: precioCompra!,
        descuento: descuento || 0,
        vehiculoLabel: label,
        vehiculoId: id,
      }
    });

    this.ordenDeCompra.update(current => [...current, ...itemsCompra]);

    this.unidadesFormGroup.reset();
    this.unidadesFormArray.clear();
    this.vehiculoSeleccionado.set(null);
  }

  removerDelCarrito(index: number) {
    this.ordenDeCompra.update(carrito => carrito.filter((_, i) => i !== index));
  }

  procesarCompra() {
    if (!this.proveedorSeleccionado()) {
      alert('Debe seleccionar un proveedor');
      return;
    }

    if (this.ordenDeCompra().length === 0) {
      alert('Debe agregar al menos un vehículo a la orden de compra');
      return;
    }

    if (this.compraFormGroup.invalid) {
      alert('Ingrese los detalles de la compra');
      markFormGroupAsDirty(this.compraFormGroup);
      return;
    }

    if (this.documentoFormGroup.invalid) {
      alert('Ingrese los detalles del documento de compra');
      markFormGroupAsDirty(this.documentoFormGroup);
      return;
    }

    const compraData: any = {
      proveedorId: this.proveedorSeleccionado()!.id,
      compra: this.compraFormGroup.getRawValue(),
      documento: this.documentoFormGroup.getRawValue(),
      items: this.ordenDeCompra().map(item => ({
        vehiculoId: item.vehiculoId,
        vin: item.vin,
        descuento: item.descuento,
        precioCompra: item.precioCompra
      }))
    };

    this.runningTask.set(true);

    this.compraService.registrarCompra(compraData).subscribe({
      next: () => this.router.navigate(['/panel/ventas']),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  // Form Array
  crearUnidadFormGroup() {
    return this.formBuilder.group({
      vin: this.formBuilder.control('', Validators.required),
      descuento: this.formBuilder.control<number | null>(0, [Validators.required, Validators.min(0)]),
    });
  }

  insertarUnidad() {
    this.unidadesFormArray.push(this.crearUnidadFormGroup());
  }

  eliminarUnidad(index: number) {
    this.unidadesFormArray.removeAt(index);
  }

  get unidadesFormArray() {
    return this.unidadesFormGroup.controls.unidades as FormArray;
  }

  get subtotal(): number {
    return this.ordenDeCompra().reduce((sum, item) => sum + item.precioCompra, 0);
  }

  get total(): number {
    return this.subtotal - this.descuento;
  }

  get descuento(): number {
    return this.ordenDeCompra().reduce((sum, item) => sum + item.descuento, 0);
  }

}
