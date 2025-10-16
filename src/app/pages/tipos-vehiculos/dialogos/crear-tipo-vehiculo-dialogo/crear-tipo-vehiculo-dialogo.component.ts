import { Component, inject } from '@angular/core';
import { TipoVehiculoService } from '../../services/tipo-vehiculo.service';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';

@Component({
  selector: 'app-crear-tipo-vehiculo-dialogo',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './crear-tipo-vehiculo-dialogo.component.html',
  styles: ``
})
export class CrearTipoVehiculoDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private tipoVehiculoService = inject(TipoVehiculoService);
  private dialogRef = inject(DynamicDialogRef<CrearTipoVehiculoDialogoComponent>);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.tipoVehiculoService.create(this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}