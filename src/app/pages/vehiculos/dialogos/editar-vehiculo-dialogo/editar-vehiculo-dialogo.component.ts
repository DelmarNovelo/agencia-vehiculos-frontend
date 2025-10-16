import { Component, effect, inject, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VehiculoService } from '../../services/vehiculo.service';
import { VehiculoFormComponent } from '../../components/vehiculo-form/vehiculo-form.component';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { Button } from 'primeng/button';
import { NgIf } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { EditarVehiculoDto } from '../../dto/editar-vehiculo.dto';

@Component({
  selector: 'app-editar-vehiculo-dialogo',
  imports: [
    NgIf,
    LoadingComponent,
    VehiculoFormComponent,
    Button,
  ],
  templateUrl: './editar-vehiculo-dialogo.component.html',
  styles: ``
})
export class EditarVehiculoDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private vehiculoService = inject(VehiculoService);
  private vehiculoId = inject(DynamicDialogConfig).data as string;
  private dialogRef = inject(DynamicDialogRef<EditarVehiculoDialogoComponent>);

  runningTask = signal(false);

  vehiculo = this.vehiculoService.fetchOne(this.vehiculoId);

  formGroup = this.formBuilder.group({
    marcaId: this.formBuilder.control<number | null>(null, Validators.required),
    lineaId: this.formBuilder.control<number | null>(null, Validators.required),
    modeloId: this.formBuilder.control<number | null>(null, Validators.required),
    colorId: this.formBuilder.control<number | null>(null, Validators.required),
    combustibleId: this.formBuilder.control<number | null>(null, Validators.required),
    transmisionId: this.formBuilder.control<number | null>(null, Validators.required),
    tipoVehiculoId: this.formBuilder.control<number | null>(null, Validators.required),
    descripcion: this.formBuilder.control(''),
  });

  constructor() {
    effect(() => {
      if (this.vehiculo.value()) {
        const { marcaId, lineaId, modeloId, colorId, combustibleId, transmisionId, tipoVehiculoId, descripcion } = this.vehiculo.value()!;
        this.formGroup.patchValue({
          modeloId,
          colorId,
          combustibleId,
          transmisionId,
          tipoVehiculoId,
          descripcion,
        });

        this.formGroup.controls.marcaId.setValue(marcaId);
        this.formGroup.controls.lineaId.setValue(lineaId);
      }
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { marcaId, lineaId, modeloId, colorId, combustibleId, transmisionId, tipoVehiculoId, descripcion } = this.formGroup.getRawValue();

    const editarVehiculoDto: EditarVehiculoDto = {
      marcaId: marcaId!,
      lineaId: lineaId!,
      modeloId: modeloId!,
      colorId: colorId!,
      combustibleId: combustibleId!,
      transmisionId: transmisionId!,
      tipoVehiculoId: tipoVehiculoId!,
      descripcion: descripcion,
    }

    this.runningTask.set(true);

    this.vehiculoService.update(this.vehiculoId, editarVehiculoDto).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false),
    });
  }

}
