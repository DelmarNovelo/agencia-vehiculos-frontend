import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { IftaLabel } from "primeng/iftalabel";
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UnidadVehicularService } from '../../services/unidad-vehicular.service';

@Component({
  selector: 'app-crear-unidad-vehicular',
  imports: [
    FormControlErrorComponent,
    ReactiveFormsModule,
    InputText,
    Button,
    IftaLabel
  ],
  templateUrl: './crear-unidad-vehicular.component.html',
  styles: ``
})
export class CrearUnidadVehicularComponent {

  formBuilder = inject(NonNullableFormBuilder);
  private unidadVehicularService = inject(UnidadVehicularService);
  private vehiculoId = inject(DynamicDialogConfig).data as number;
  private dialogRef = inject(DynamicDialogRef<CrearUnidadVehicularComponent>);

  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    vin: this.formBuilder.control('', Validators.required)
  });

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.runningTask.set(true);

    this.unidadVehicularService.crearUnidadVehicular(this.formGroup.value, this.vehiculoId).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'vin');
  }

}
