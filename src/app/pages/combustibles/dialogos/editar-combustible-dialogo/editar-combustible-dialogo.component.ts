import { Component, effect, inject } from '@angular/core';
import { CombustibleService } from '../../services/combustible.service';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';

@Component({
  selector: 'app-editar-combustible-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './editar-combustible-dialogo.component.html',
  styles: ``
})
export class EditarCombustibleDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private combustibleService = inject(CombustibleService);
  private combustibleId = inject(DynamicDialogConfig).data.combustibleId;
  private dialogRef = inject(DynamicDialogRef<EditarCombustibleDialogoComponent>);

  combustibleDetalles = this.combustibleService.fetchOne(this.combustibleId);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.combustibleDetalles.value()) {
        this.formGroup.patchValue(this.combustibleDetalles.value()!);
      }
    })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { id } = this.combustibleDetalles.value()!;

    this.combustibleService.update(id, this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}
