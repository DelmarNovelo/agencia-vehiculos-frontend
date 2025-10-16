import { Component, effect, inject } from '@angular/core';
import { TipoContactoService } from '../../services/tipo-contacto.service';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-editar-tipo-contacto-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    LoadingComponent,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './editar-tipo-contacto-dialogo.component.html',
  styles: ``
})
export class EditarTipoContactoDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private tipoContactoService = inject(TipoContactoService);
  private tipoContactoId = inject(DynamicDialogConfig).data;
  private dialogRef = inject(DynamicDialogRef<EditarTipoContactoDialogoComponent>);

  tipoContactoDetalles = this.tipoContactoService.fetchOne(this.tipoContactoId);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.tipoContactoDetalles.value()) {
        this.formGroup.patchValue(this.tipoContactoDetalles.value()!);
      }
    })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { id } = this.tipoContactoDetalles.value()!;

    this.tipoContactoService.update(id, this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}
