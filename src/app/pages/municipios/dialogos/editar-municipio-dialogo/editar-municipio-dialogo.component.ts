import { Component, effect, inject } from '@angular/core';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { MunicipioService } from '../../services/municipio.service';

@Component({
  selector: 'app-editar-municipio-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    LoadingComponent,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './editar-municipio-dialogo.component.html',
  styles: ``
})
export class EditarMunicipioDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private municipioService = inject(MunicipioService);
  private municipioId = inject(DynamicDialogConfig).data;
  private dialogRef = inject(DynamicDialogRef<EditarMunicipioDialogoComponent>);

  municipioDetalles = this.municipioService.fetchOne(this.municipioId);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.municipioDetalles.value()) {
        this.formGroup.patchValue(this.municipioDetalles.value()!);
      }
    })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { id } = this.municipioDetalles.value()!;

    this.municipioService.update(id, this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}
