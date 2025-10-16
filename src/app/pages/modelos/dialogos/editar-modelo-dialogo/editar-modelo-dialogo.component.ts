import { Component, effect, inject } from '@angular/core';
import { ModeloService } from '../../services/modelo.service';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';

@Component({
  selector: 'app-editar-modelo-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './editar-modelo-dialogo.component.html',
  styles: ``
})
export class EditarModeloDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private modeloService = inject(ModeloService);
  private modeloId = inject(DynamicDialogConfig).data.modeloId;
  private dialogRef = inject(DynamicDialogRef<EditarModeloDialogoComponent>);

  modeloDetalles = this.modeloService.fetchOne(this.modeloId);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.modeloDetalles.value()) {
        this.formGroup.patchValue(this.modeloDetalles.value()!);
      }
    })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { id } = this.modeloDetalles.value()!;

    this.modeloService.update(id, this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}
