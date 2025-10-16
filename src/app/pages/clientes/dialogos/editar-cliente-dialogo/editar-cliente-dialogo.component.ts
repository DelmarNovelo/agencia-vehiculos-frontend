import { Component, effect, inject, signal } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgIf } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { IftaLabel } from 'primeng/iftalabel';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-editar-cliente-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    LoadingComponent,
    InputText,
    IftaLabel,
    Button,
  ],
  templateUrl: './editar-cliente-dialogo.component.html',
  styles: ``
})
export class EditarClienteDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private clienteService = inject(ClienteService);
  private clienteId = inject(DynamicDialogConfig).data as number;
  private dialogRef = inject(DynamicDialogRef<EditarClienteDialogoComponent>);

  runningTask = signal(false);

  detallesCliente = this.clienteService.fetchOneDetails(this.clienteId);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
    apellido: this.formBuilder.control('', Validators.required),
    dpi: this.formBuilder.control('', Validators.required),
    nit: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.detallesCliente.value()) {
        this.formGroup.patchValue(this.detallesCliente.value()!);
      }
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.runningTask.set(true);

    this.clienteService.update(this.clienteId, this.formGroup.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  isFormControlInvalid(formControlName: string) {
    return isFormControlInvalid(this.formGroup, formControlName);
  }

}
