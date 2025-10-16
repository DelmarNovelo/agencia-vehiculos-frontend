import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { PrecioVentaService } from '../../services/precio-venta.service';

@Component({
  selector: 'app-crear-precio-venta',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    InputNumber,
    IftaLabel,
    DatePicker,
    Button,
  ],
  templateUrl: './crear-precio-venta.component.html',
  styles: ``
})
export class CrearPrecioVentaComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  precioVentaService = inject(PrecioVentaService);
  vehiculoId = inject(DynamicDialogConfig).data as number;
  private dialogRef = inject(DynamicDialogRef<CrearPrecioVentaComponent>);

  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    vigenteDesde: this.formBuilder.control(new Date(), Validators.required),
    precioBase: this.formBuilder.control(0, Validators.required),
  });

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.precioVentaService.create(this.formGroup.getRawValue(), this.vehiculoId).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false),
    });
  }

  isFormControlInvalid(formControlName: string) {
    return isFormControlInvalid(this.formGroup, formControlName);
  }

}
