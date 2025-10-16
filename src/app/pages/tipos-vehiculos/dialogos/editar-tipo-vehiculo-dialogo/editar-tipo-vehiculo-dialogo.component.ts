import { Component, effect, inject } from '@angular/core';
import { TipoVehiculoService } from '../../services/tipo-vehiculo.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';

@Component({
  selector: 'app-editar-tipo-vehiculo-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './editar-tipo-vehiculo-dialogo.component.html',
  styles: ``
})
export class EditarTipoVehiculoDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private tipoVehiculoService = inject(TipoVehiculoService);
  private tipoVehiculoId = inject(DynamicDialogConfig).data.tipoVehiculoId;
  private dialogRef = inject(DynamicDialogRef<EditarTipoVehiculoDialogoComponent>);

  tipoVehiculoDetalles = this.tipoVehiculoService.fetchOne(this.tipoVehiculoId);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.tipoVehiculoDetalles.value()) {
        this.formGroup.patchValue(this.tipoVehiculoDetalles.value()!);
      }
    })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { id } = this.tipoVehiculoDetalles.value()!;

    this.tipoVehiculoService.update(id, this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}