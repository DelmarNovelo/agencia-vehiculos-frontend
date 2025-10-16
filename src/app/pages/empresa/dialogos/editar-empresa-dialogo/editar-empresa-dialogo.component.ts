import { Component, inject, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmpresaDto } from '../../dto/empresa.dto';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-editar-empresa-dialogo',
  imports: [
    ReactiveFormsModule,
    InputText,
    Button,
    IftaLabel,
    FormControlErrorComponent,
  ],
  templateUrl: './editar-empresa-dialogo.component.html',
  styles: ``
})
export class EditarEmpresaDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private empresaService = inject(EmpresaService);
  private dialogRef = inject(DynamicDialogRef<EditarEmpresaDialogoComponent>);
  private empresa = inject(DynamicDialogConfig).data as EmpresaDto;

  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    razonSocial: this.formBuilder.control(this.empresa.razonSocial, Validators.required),
    nit: this.formBuilder.control(this.empresa.nit, Validators.required),
  });

  update() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.empresaService.update(this.empresa.id, this.formGroup.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  isFormControlInvalid(formControlName: string) {
    return isFormControlInvalid(this.formGroup, formControlName);
  }
}
