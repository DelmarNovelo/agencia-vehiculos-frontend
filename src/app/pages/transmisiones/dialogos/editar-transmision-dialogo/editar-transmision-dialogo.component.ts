import { Component, effect, inject } from '@angular/core';
import { TransmisionService } from '../../services/transmision.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-editar-transmision-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    LoadingComponent,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './editar-transmision-dialogo.component.html',
  styles: ``
})
export class EditarTransmisionDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private transmisionService = inject(TransmisionService);
  private transmisionId = inject(DynamicDialogConfig).data.transmisionId;
  private dialogRef = inject(DynamicDialogRef<EditarTransmisionDialogoComponent>);

  transmisionDetalles = this.transmisionService.fetchOne(this.transmisionId);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.transmisionDetalles.value()) {
        this.formGroup.patchValue(this.transmisionDetalles.value()!);
      }
    })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { id } = this.transmisionDetalles.value()!;

    this.transmisionService.update(id, this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}
