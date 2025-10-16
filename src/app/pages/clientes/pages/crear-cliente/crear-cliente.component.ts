import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { ClienteService } from '../../services/cliente.service';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { DireccionFormComponent } from '../../../direcciones/components/direccion-form/direccion-form.component';
import { ContactoFormComponent } from '../../../contactos/components/contacto-form/contacto-form.component';

@Component({
  selector: 'app-crear-cliente',
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
  templateUrl: './crear-cliente.component.html',
  styles: ``
})
export default class CrearClienteComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    persona: this.formBuilder.group({
      nombre: this.formBuilder.control('', Validators.required),
      apellido: this.formBuilder.control('', Validators.required),
      dpi: this.formBuilder.control('', Validators.required),
      nit: this.formBuilder.control('', Validators.required),
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

    const { persona, contacto, direccion } = this.formGroup.getRawValue();

    const data: any = {
      persona,
      contactos: contacto.contactos,
      direccion,
    }

    this.runningTask.set(true);

    this.clienteService.create(data).subscribe({
      next: () => this.router.navigate(['/panel/clientes']),
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
