import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnidadesVehicularesFormComponent } from '../../components/unidades-vehiculares-form/unidades-vehiculares-form.component';
import { markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { CrearVehiculoDto } from '../../dto/crear-vehiculo.dto';
import { VehiculoService } from '../../services/vehiculo.service';
import { Router } from '@angular/router';
import { VehiculoFormComponent } from '../../components/vehiculo-form/vehiculo-form.component';

@Component({
  selector: 'app-nuevo-vehiculo',
  imports: [
    ReactiveFormsModule,
    UnidadesVehicularesFormComponent,
    VehiculoFormComponent,
    Card,
    Button,
  ],
  templateUrl: './nuevo-vehiculo.component.html',
  styles: ``
})
export default class NuevoVehiculoComponent {

  private router = inject(Router);
  private formBuilder = inject(NonNullableFormBuilder);
  private vehiculoService = inject(VehiculoService);

  formGroup = this.formBuilder.group({
    marcaId: this.formBuilder.control<number | null>(null, Validators.required),
    lineaId: this.formBuilder.control<number | null>(null, Validators.required),
    modeloId: this.formBuilder.control<number | null>(null, Validators.required),
    colorId: this.formBuilder.control<number | null>(null, Validators.required),
    combustibleId: this.formBuilder.control<number | null>(null, Validators.required),
    transmisionId: this.formBuilder.control<number | null>(null, Validators.required),
    tipoVehiculoId: this.formBuilder.control<number | null>(null, Validators.required),
    precioVenta: this.formBuilder.control(null, Validators.required),
    descripcion: this.formBuilder.control(''),
  });

  unidadesFormGroup = this.formBuilder.group({
    unidades: this.formBuilder.array<any[]>([]),
  });

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    if (this.unidadesFormGroup.invalid) {
      const formArray = this.unidadesFormGroup.controls.unidades as FormArray;
      formArray.controls.forEach((formGroup: any) => markFormGroupAsDirty(formGroup));
      return;
    }

    const { marcaId, lineaId, modeloId, colorId, combustibleId, transmisionId, tipoVehiculoId, precioVenta, descripcion } = this.formGroup.getRawValue();

    const crearVehiculoDto: CrearVehiculoDto = {
      marcaId: marcaId!,
      lineaId: lineaId!,
      modeloId: modeloId!,
      colorId: colorId!,
      combustibleId: combustibleId!,
      transmisionId: transmisionId!,
      tipoVehiculoId: tipoVehiculoId!,
      precioVenta: precioVenta!,
      descripcion: descripcion,
      unidades: this.unidadesFormGroup.controls.unidades.getRawValue(),
    }

    this.vehiculoService.create(crearVehiculoDto).subscribe({
      next: () => this.router.navigate(['/panel/vehiculos/lista']),
    });
  }

}
