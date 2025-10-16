import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { ProveedorService } from '../../services/proveedor.service';

interface DialogData {
  id: number;
  razonSocial: string;
  nit?: string;
}

@Component({
  selector: 'app-editar-proveedor-dialogo',
  imports: [
    ReactiveFormsModule,
    IftaLabel,
    InputText,
    Button,
    FormControlErrorComponent,
  ],
  templateUrl: './editar-proveedor-dialogo.component.html',
  styles: ``
})
export class EditarProveedorDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private proveedorService = inject(ProveedorService);
  private dialogData = inject(DynamicDialogConfig).data as DialogData;
  private dialogRef = inject(DynamicDialogRef<EditarProveedorDialogoComponent>);

  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    razonSocial: this.formBuilder.control(this.dialogData.razonSocial),
    nit: this.formBuilder.control(this.dialogData.nit),
  });

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.runningTask.set(true);

    this.proveedorService.update(this.dialogData.id, this.formGroup.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  isFormControlInvalid(controlName: string) {
    return isFormControlInvalid(this.formGroup, controlName);
  }

}
