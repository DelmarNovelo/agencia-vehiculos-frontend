import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModuloPermisoService } from '../../../modulo-permisos/services/modulo-permiso.service';
import { NgFor } from '@angular/common';
import { IftaLabel } from 'primeng/iftalabel';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-crear-rol-dialogo',
  imports: [
    NgFor,
    Button,
    InputText,
    Textarea,
    FormControlErrorComponent,
    Checkbox,
    FormsModule,
    IftaLabel,
    ReactiveFormsModule
  ],
  templateUrl: './crear-rol-dialogo.component.html',
  styles: ``
})
export class CrearRolDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private rolService = inject(RolService);
  private moduloPermisoService = inject(ModuloPermisoService);
  private dialogRef = inject(DynamicDialogRef<CrearRolDialogoComponent>);

  runningTask = signal(false);
  permisosSeleccionados = signal<number[]>([]);

  modulos = this.moduloPermisoService.fetchAll();

  rolFormGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
    descripcion: this.formBuilder.control(''),
  });

  onSubmit() {
    if (this.rolFormGroup.invalid) {
      markFormGroupAsDirty(this.rolFormGroup);
      return;
    }

    this.runningTask.set(true);

    this.rolService.create({ ...this.rolFormGroup.getRawValue(), permisos: this.permisosSeleccionados() })
    .subscribe({
      next: response => this.dialogRef.close(response),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  seleccionarTodos() {
    const allIds = this.modulos.value().reduce((total, modulo) =>
      total.concat(modulo.permisos.map((p: any) => p.id)), []);
    this.permisosSeleccionados.set(allIds);
  }

  deseleccionarTodos() {
    this.permisosSeleccionados.set([]);
  }

  isFormControlInvalid(controlName: string) {
    return isFormControlInvalid(this.rolFormGroup, controlName);
  }

  get totalPermisos() {
    return this.modulos.value().reduce((total, modulo) => total + modulo.permisos.length, 0);
  }

}
