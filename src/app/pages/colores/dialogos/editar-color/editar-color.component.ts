import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { ColorService } from '../../services/color.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-editar-color',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './editar-color.component.html',
  styles: ``
})
export class EditarColorComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private colorService = inject(ColorService);
  private colorId = inject(DynamicDialogConfig).data.colorId;
  private dialogRef = inject(DynamicDialogRef<EditarColorComponent>);

  colorDetalles = this.colorService.fetchOne(this.colorId);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.colorDetalles.value()) {
        this.formGroup.patchValue(this.colorDetalles.value()!);
      }
    })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { id } = this.colorDetalles.value()!;

    this.colorService.update(id, this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}
