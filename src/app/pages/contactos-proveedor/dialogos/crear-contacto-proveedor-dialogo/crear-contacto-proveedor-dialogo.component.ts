import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { ContactoProveedorService } from '../../services/contacto-proveedor.service';
import { ContactoFormComponent } from '../../../contactos/components/contacto-form/contacto-form.component';

@Component({
  selector: 'app-crear-contacto-proveedor-dialogo',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    InputText,
    IftaLabel,
    Button,
    ContactoFormComponent,
  ],
  templateUrl: './crear-contacto-proveedor-dialogo.component.html',
  styles: ``
})
export class CrearContactoProveedorDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private contactoProveedorService = inject(ContactoProveedorService);
  private proveedorId = inject(DynamicDialogConfig).data as number;
  private dialogRef = inject(DynamicDialogRef<CrearContactoProveedorDialogoComponent>);

  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    persona: this.formBuilder.group({
      cargo: this.formBuilder.control('', Validators.required),
      nombre: this.formBuilder.control('', Validators.required),
      apellido: this.formBuilder.control('', Validators.required),
    }),
    contacto: this.formBuilder.group({
      contactos: this.formBuilder.array([])
    }),
  });

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup.controls.persona);
      this.formGroup.controls.contacto.controls.contactos.controls.forEach((fg: any) => markFormGroupAsDirty(fg));
      return;
    }

    const { persona, contacto } = this.formGroup.getRawValue();

    const data: any = {
      persona,
      contactos: contacto.contactos,
    }
    
    this.runningTask.set(true);

    this.contactoProveedorService.crear(this.proveedorId, data).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  isFormControlInvalid(controlName: string) {
    return isFormControlInvalid(this.formGroup.controls.persona, controlName);
  }

}
