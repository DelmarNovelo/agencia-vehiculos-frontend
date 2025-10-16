import { Component, inject, OnDestroy, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { ContactoFormComponent } from '../../../contactos/components/contacto-form/contacto-form.component';
import { DireccionFormComponent } from '../../../direcciones/components/direccion-form/direccion-form.component';
import { RolService } from '../../../roles/services/rol.service';
import { Select } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-crear-usuario',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Card,
    Button,
    IftaLabel,
    DatePicker,
    Select,
    InputText,
    DireccionFormComponent,
    ContactoFormComponent,
    FormControlErrorComponent,
  ],
  templateUrl: './crear-usuario.component.html',
  styles: ``
})
export default class CrearUsuarioComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private formBuilder = inject(NonNullableFormBuilder);
  private usuarioService = inject(UsuarioService);
  private rolService = inject(RolService);
  private router = inject(Router);

  runningTask = signal(false);
  roles = this.rolService.fetchAllForSelect();

  formGroup = this.formBuilder.group({
    persona: this.formBuilder.group({
      nombre: this.formBuilder.control('', Validators.required),
      apellido: this.formBuilder.control('', Validators.required),
      dpi: this.formBuilder.control(''),
      nit: this.formBuilder.control(''),
    }),
    empleado: this.formBuilder.group({
      email: this.formBuilder.control('', Validators.required),
      password: this.formBuilder.control('', Validators.required),
      rolId: this.formBuilder.control<number | null>(null, Validators.required),
      fechaContratacion: this.formBuilder.control('', Validators.required),
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      this.formGroup.controls.contacto.controls.contactos.controls.forEach((fg: any) => markFormGroupAsDirty(fg));
      return;
    }

    const { persona, empleado, contacto, direccion } = this.formGroup.getRawValue();

    const data: any = {
      persona,
      contactos: contacto.contactos,
      direccion,
      empleado,
    }

    this.runningTask.set(true);

    this.usuarioService.create(data).subscribe({
      next: () => this.router.navigate(['/panel/usuarios']),
      error: () => {
        this.runningTask.set(false);
      },
      complete: () => this.runningTask.set(false)
    });
  }

  nuevoRolDialogo() {
    const dialogRef = this.rolService.nuevoRolDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response) {
          this.roles.update(currentValue => [...currentValue, response]);
          
          const { empleado } = this.formGroup.controls;
          const { rolId } = empleado.controls;
          rolId.setValue(response.id);
        }
      });
  }

  isFormControlInvalid(formGroupName: string, formControlName: string) {
    const formGroup = this.formGroup.get(formGroupName) as FormGroup;
    return isFormControlInvalid(formGroup, formControlName);
  }
}
