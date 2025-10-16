import { Component, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactoProveedorService } from '../../services/contacto-proveedor.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { IftaLabel } from 'primeng/iftalabel';
import { Button } from 'primeng/button';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';

@Component({
  selector: 'app-editar-contact-proveedor-dialogo',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    InputText,
    IftaLabel,
    Button,
  ],
  templateUrl: './editar-contact-proveedor-dialogo.component.html',
  styles: ``
})
export class EditarContactProveedorDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private contactoProveedorService = inject(ContactoProveedorService);
  private cpId = inject(DynamicDialogConfig).data as number;
  private dialogRef = inject(DynamicDialogRef<EditarContactProveedorDialogoComponent>);

  runningTask = signal(false);
  contactoProveedor = this.contactoProveedorService.fetchOne(this.cpId);

  formGroup = this.formBuilder.group({
    cargo: this.formBuilder.control('', Validators.required),
    nombre: this.formBuilder.control('', Validators.required),
    apellido: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.contactoProveedor.value()) {
        this.formGroup.patchValue(this.contactoProveedor.value()!);
      }
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.runningTask.set(true);

    this.contactoProveedorService.update(this.cpId, this.formGroup.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  isFormControlInvalid(controlName: string) {
    return isFormControlInvalid(this.formGroup, controlName);
  }

}
