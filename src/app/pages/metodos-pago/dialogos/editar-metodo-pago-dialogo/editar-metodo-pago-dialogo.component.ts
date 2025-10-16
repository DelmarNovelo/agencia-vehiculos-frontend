import { NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { MetodoPagoService } from '../../services/metodo-pago.service';

@Component({
  selector: 'app-editar-metodo-pago-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    LoadingComponent,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './editar-metodo-pago-dialogo.component.html',
  styles: ``
})
export class EditarMetodoPagoDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private metodoPagoService = inject(MetodoPagoService);
  private metodoPagoId = inject(DynamicDialogConfig).data;
  private dialogRef = inject(DynamicDialogRef<EditarMetodoPagoDialogoComponent>);

  metodoPagoDetalles = this.metodoPagoService.fetchOne(this.metodoPagoId);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.metodoPagoDetalles.value()) {
        this.formGroup.patchValue(this.metodoPagoDetalles.value()!);
      }
    })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { id } = this.metodoPagoDetalles.value()!;

    this.metodoPagoService.update(id, this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}
