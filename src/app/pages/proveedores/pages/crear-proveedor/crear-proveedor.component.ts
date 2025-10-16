import { Component, inject, signal } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { ContactoFormComponent } from '../../../contactos/components/contacto-form/contacto-form.component';
import { DireccionFormComponent } from '../../../direcciones/components/direccion-form/direccion-form.component';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';

@Component({
  selector: 'app-crear-proveedor',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Card,
    Button,
    IftaLabel,
    InputText,
    DireccionFormComponent,
    ContactoFormComponent,
    FormControlErrorComponent,
  ],
  templateUrl: './crear-proveedor.component.html',
  styles: ``
})
export default class CrearProveedorComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private proveedorService = inject(ProveedorService);
  private router = inject(Router);

  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    legal: this.formBuilder.group({
      razonSocial: this.formBuilder.control('', Validators.required),
      nit: this.formBuilder.control(''),
    }),
    persona: this.formBuilder.group({
      cargo: this.formBuilder.control('', Validators.required),
      nombre: this.formBuilder.control('', Validators.required),
      apellido: this.formBuilder.control('', Validators.required),
    }),
    contacto: this.formBuilder.group({
      contactos: this.formBuilder.array([])
    }),
    direccion: this.formBuilder.group({
      calle: this.formBuilder.control('', Validators.required),
      departamentoId: this.formBuilder.control<number | null>(null, Validators.required),
      municipioId: this.formBuilder.control<number | null>(null, Validators.required),
    }),
  });

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      this.formGroup.controls.contacto.controls.contactos.controls.forEach((fg: any) => markFormGroupAsDirty(fg));
      return;
    }

    const { legal, persona, contacto, direccion } = this.formGroup.getRawValue();

    const data: any = {
      legal,
      persona,
      contactos: contacto.contactos,
      direccion,
    }

    this.runningTask.set(true);

    this.proveedorService.create(data).subscribe({
      next: () => this.router.navigate(['/panel/proveedores']),
      error: () => {
        this.runningTask.set(false);
      },
      complete: () => this.runningTask.set(false)
    });
  }

  isFormControlInvalid(formGroupName: string, formControlName: string) {
    const formGroup = this.formGroup.get(formGroupName) as FormGroup;
    return isFormControlInvalid(formGroup, formControlName);
  }
}
