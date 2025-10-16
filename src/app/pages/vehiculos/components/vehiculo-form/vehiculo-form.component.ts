import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IftaLabel } from 'primeng/iftalabel';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { Router } from '@angular/router';
import { ColorService } from '../../../colores/services/color.service';
import { CombustibleService } from '../../../combustibles/services/combustible.service';
import { LineaForSelectDto } from '../../../lineas/dto/linea-for-select.dto';
import { LineaService } from '../../../lineas/services/linea.service';
import { MarcaService } from '../../../marcas/services/marca.service';
import { ModeloService } from '../../../modelos/services/modelo.service';
import { TipoVehiculoService } from '../../../tipos-vehiculos/services/tipo-vehiculo.service';
import { TransmisionService } from '../../../transmisiones/services/transmision.service';
import { VehiculoService } from '../../services/vehiculo.service';
import { Subject, takeUntil } from 'rxjs';
import { isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { ColorForSelectDto } from '../../../colores/dto/color-for-select.dto';
import { CombustibleForSelectDto } from '../../../combustibles/dto/combustible-for-select.dto';
import { MarcaResponseDto } from '../../../marcas/dto/marca-response.dto';
import { ModeloForSelectDto } from '../../../modelos/dto/modelo.for-select.dto';
import { TipoVehiculoForSelectDto } from '../../../tipos-vehiculos/dto/tipo-vehiculo-for-select.dto';
import { TransmisionForSelectDto } from '../../../transmisiones/dto/transmision-for-select.dto';
import { Button } from 'primeng/button';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-vehiculo-form',
  imports: [
    NgIf,
    NgClass,
    ReactiveFormsModule,
    FormControlErrorComponent,
    IftaLabel,
    Textarea,
    InputNumber,
    Select,
    Button,
  ],
  templateUrl: './vehiculo-form.component.html',
  styles: ``
})
export class VehiculoFormComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private router = inject(Router);
  private vehiculoService = inject(VehiculoService);
  private marcaService = inject(MarcaService);
  private lineaService = inject(LineaService);
  private modeloService = inject(ModeloService);
  private colorService = inject(ColorService);
  private combustibleService = inject(CombustibleService);
  private transmisionService = inject(TransmisionService);
  private tipoVehiculoService = inject(TipoVehiculoService);

  marcas = this.marcaService.findAllForSelect();
  lineas = signal<LineaForSelectDto[]>([]);
  modelos = this.modeloService.fetchAllForSelect();
  colores = this.colorService.fetchAllForSelect();
  combustibles = this.combustibleService.fetchAllForSelect();
  transmisiones = this.transmisionService.fetchAllForSelect();
  tiposVehiculos = this.tipoVehiculoService.fetchAllForSelect();

  formGroup = input.required<FormGroup<any>>()
  initialMarcaId = input<number | null>(null)
  incluirPrecioVenta = input(true);
  
  ngOnInit(): void {
    this.formValueChanges();

    // Cargar lineas iniciales si el marcaId es proporcionado (para el modo de edición)
    if (this.initialMarcaId()) {
      this.fetchLineasForSelect(this.initialMarcaId()!);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  formValueChanges() {
    const { marcaId, lineaId } = this.formGroup().controls;

    marcaId.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        lineaId.reset();
        this.fetchLineasForSelect(value!);
      });
  }

  fetchLineasForSelect(marcaId: number) {
    this.lineaService.fetchAllForSelect(marcaId).subscribe({
      next: response => this.lineas.set(response),
    });
  }

  nuevaMarcaDialogo() {
    const dialogRef = this.marcaService.nuevaMarcaDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: MarcaResponseDto | null) => {
        if (response) {
          const { marcaId } = this.formGroup().controls;
          const { id, nombre, lineas } = response;

          this.marcas.update(currentValue => ([...currentValue, { id, nombre }]));
          marcaId.setValue(id, { emitEvent: false });
          this.lineas.set(lineas);
        }
      });
  }

  nuevaLineaDialogo() {
    const { marcaId } = this.formGroup().getRawValue();
    if (!marcaId) {
      return;
    }

    const dialogRef = this.lineaService.nuevaLineaDialogo(marcaId);
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: LineaForSelectDto | null) => {
        if (response) {
          const { lineaId } = this.formGroup().controls;
          const { id, nombre } = response;

          this.lineas.update(currentValue => ([...currentValue, { id, nombre }]));
          lineaId.setValue(id, { emitEvent: false });
        }
      });
  }

  nuevaModeloDialogo() {
    const dialogRef = this.modeloService.nuevoModeloDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: ModeloForSelectDto | null) => {
        if (response) {
          const { modeloId } = this.formGroup().controls;
          const { id, nombre } = response;

          this.modelos.update(currentValue => ([...currentValue, { id, nombre }]));
          modeloId.setValue(id);
        }
      });
  }

  nuevoColorDialogo() {
    const dialogRef = this.colorService.nuevoColorDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: ColorForSelectDto | null) => {
        if (response) {
          const { colorId } = this.formGroup().controls;
          const { id, nombre } = response;

          this.colores.update(currentValue => ([...currentValue, { id, nombre }]));
          colorId.setValue(id);
        }
      });
  }

  nuevoCombustibleDialogo() {
    const dialogRef = this.combustibleService.nuevoCombustibleDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: CombustibleForSelectDto | null) => {
        if (response) {
          const { combustibleId } = this.formGroup().controls;
          const { id, nombre } = response;
          this.combustibles.update(currentValue => ([...currentValue, { id, nombre }]));
          combustibleId.setValue(id);
        }
      });
  }

  nuevaTransmisionDialogo() {
    const dialogRef = this.transmisionService.nuevaTransmisionDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: TransmisionForSelectDto | null) => {
        if (response) {
          const { transmisionId } = this.formGroup().controls;
          const { id, nombre } = response;
          this.transmisiones.update(currentValue => ([...currentValue, { id, nombre }]));
          transmisionId.setValue(id);
        }
      });
  }

  nuevoTipoVehiculoDialogo() {
    const dialogRef = this.tipoVehiculoService.nuevoTipoVehiculoDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: TipoVehiculoForSelectDto | null) => {
        if (response) {
          const { tipoVehiculoId } = this.formGroup().controls;
          const { id, nombre } = response;
          this.tiposVehiculos.update(currentValue => ([...currentValue, { id, nombre }]));
          tipoVehiculoId.setValue(id);
        }
      });
  }

  isFormControlInvalid(formControlName: string) {
    return isFormControlInvalid(this.formGroup(), formControlName);
  }
}
