import { Component, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { DepartamentoService } from '../../services/departamento.service';

@Component({
  selector: 'app-editar-departamento',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    InputText,
    Button,
    IftaLabel,
  ],
  templateUrl: './editar-departamento.component.html',
  styles: ``
})
export class EditarDepartamentoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private departamentoService = inject(DepartamentoService);
  private departamentoId = inject(DynamicDialogConfig).data as number;
  private dialogRef = inject(DynamicDialogRef<EditarDepartamentoComponent>);

  runningTask = signal(false);

  departamento = this.departamentoService.fetchOne(this.departamentoId);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.departamento.value()) {
        this.formGroup.patchValue(this.departamento.value()!);
      }
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.departamentoService.update(this.departamentoId, this.formGroup.getRawValue()).subscribe({
      next: res => this.dialogRef.close(res),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  isFormControlInvalid(formControlName: string) {
    return isFormControlInvalid(this.formGroup, formControlName);
  }

}
