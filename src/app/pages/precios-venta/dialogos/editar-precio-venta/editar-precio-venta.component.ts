import { Component, effect, inject, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrecioVentaService } from '../../services/precio-venta.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { InputNumber } from 'primeng/inputnumber';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';

@Component({
  selector: 'app-editar-precio-venta',
  imports: [
    DatePipe,
    NgIf,
    ReactiveFormsModule,
    LoadingComponent,
    FormControlErrorComponent,
    IftaLabel,
    InputNumber,
    Button,
  ],
  templateUrl: './editar-precio-venta.component.html',
  styles: ``
})
export class EditarPrecioVentaComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  precioVentaService = inject(PrecioVentaService);
  precioVentaId = inject(DynamicDialogConfig).data as number;
  private dialogRef = inject(DynamicDialogRef<EditarPrecioVentaComponent>);

  precioVenta = this.precioVentaService.fetchOne(this.precioVentaId);

  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    precioBase: this.formBuilder.control(0, Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.precioVenta.value()) {
        const { precioBase } = this.formGroup.controls;
        precioBase.setValue(this.precioVenta.value()!.precioBase);
      }
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.precioVentaService.update(this.precioVentaId, this.formGroup.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'precioBase');
  }

}
