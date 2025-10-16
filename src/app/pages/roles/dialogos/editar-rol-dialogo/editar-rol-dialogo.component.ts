import { Component, effect, inject, signal } from '@angular/core';
import { RolService } from '../../services/rol.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { ModuloPermisoService } from '../../../modulo-permisos/services/modulo-permiso.service';
import { NgFor, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-editar-rol-dialogo',
  imports: [
    NgIf,
    NgFor,
    Button,
    InputText,
    Textarea,
    FormControlErrorComponent,
    LoadingComponent,
    Checkbox,
    FormsModule,
    IftaLabel,
    ReactiveFormsModule
  ],
  templateUrl: './editar-rol-dialogo.component.html',
  styles: ``
})
export class EditarRolDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private rolService = inject(RolService);
  private moduloPermisoService = inject(ModuloPermisoService);
  private dialogRef = inject(DynamicDialogRef<EditarRolDialogoComponent>);
  private rolId = inject(DynamicDialogConfig).data as number;

  runningTask = signal(false);
  permisosSeleccionados = signal<number[]>([]);

  modulos = this.moduloPermisoService.fetchAll();
  rolDetalles = this.rolService.fetchOne(this.rolId);

  rolFormGroup = this.formBuilder.group({
    nombre: this.formBuilder.control({ value: '', disabled: !this.rolDetalles.value()?.canBeDeleted }, Validators.required),
    descripcion: this.formBuilder.control({ value: '', disabled: !this.rolDetalles.value()?.canBeDeleted }),
  });

  constructor() {
    effect(() => {
      if (this.rolDetalles.value()) {
        const { nombre, descripcion, permisos } = this.rolDetalles.value()!;

        this.rolFormGroup.patchValue({ nombre, descripcion });
        this.permisosSeleccionados.set(permisos);
      }
    });
  }

  onSubmit() {
    if (!this.rolDetalles.value()?.canBeDeleted) {
      alert('Este rol no puede ser editado porque es un rol predeterminado del sistema')
      return;
    }

    if (this.rolFormGroup.invalid) {
      markFormGroupAsDirty(this.rolFormGroup);
      return;
    }

    this.runningTask.set(true);

    this.rolService.update(this.rolId, { ...this.rolFormGroup.getRawValue(), permisos: this.permisosSeleccionados() }).subscribe({
      next: () => this.dialogRef.close(true),
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
