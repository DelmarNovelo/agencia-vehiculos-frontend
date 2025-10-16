import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { RolService } from '../../../roles/services/rol.service';
import { Subject, takeUntil } from 'rxjs';
import { NgIf } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-editar-usuario-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    Button,
    IftaLabel,
    DatePicker,
    Select,
    InputText,
    FormControlErrorComponent,
    LoadingComponent,
  ],
  templateUrl: './editar-usuario-dialogo.component.html',
  styles: ``
})
export class EditarUsuarioDialogoComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private formBuilder = inject(NonNullableFormBuilder);
  private rolService = inject(RolService);
  private usuarioService = inject(UsuarioService);
  private usuarioId = inject(DynamicDialogConfig).data as number;
  private dialogRef = inject(DynamicDialogRef<EditarUsuarioDialogoComponent>);

  runningTask = signal(false);
  roles = this.rolService.fetchAllForSelect();
  detallesUsuario = this.usuarioService.fetchOneDetails(this.usuarioId);

  formGroup = this.formBuilder.group({
    persona: this.formBuilder.group({
      nombre: this.formBuilder.control('', Validators.required),
      apellido: this.formBuilder.control('', Validators.required),
      dpi: this.formBuilder.control(''),
      nit: this.formBuilder.control(''),
    }),
    empleado: this.formBuilder.group({
      email: this.formBuilder.control('', Validators.required),
      rolId: this.formBuilder.control<number | null>(null, Validators.required),
      fechaContratacion: this.formBuilder.control<Date | string>('', Validators.required),
    }),
  });

  constructor() {
    effect(() => {
      if (this.detallesUsuario.value()) {
        const { persona, empleado: { fechaContratacion, email, rolId } } = this.detallesUsuario.value()!;
        this.formGroup.controls.persona.patchValue(persona);
        this.formGroup.controls.empleado.patchValue({
          email,
          fechaContratacion: new Date(fechaContratacion),
          rolId
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.runningTask.set(true);

    this.usuarioService.update(this.usuarioId, this.formGroup.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
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
