import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { MunicipioService } from '../../services/municipio.service';
import { DepartamentoService } from '../../../departamentos/services/departamento.service';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-crear-municipio-dialogo',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    IftaLabel,
    InputText,
    Button,
    Select,
  ],
  templateUrl: './crear-municipio-dialogo.component.html',
  styles: ``
})
export class CrearMunicipioDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private municipioService = inject(MunicipioService);
  private departamentoService = inject(DepartamentoService);
  private departamentoId = inject(DynamicDialogConfig).data;
  private dialogRef = inject(DynamicDialogRef<CrearMunicipioDialogoComponent>);

  runningTask = signal(false);
  
  departamentos = this.departamentoService.fetchAllForSelect();

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
    departamentoId: this.formBuilder.control(0, Validators.required),
  });

  constructor() {
    if (this.departamentoId) {
      this.formGroup.patchValue({ departamentoId: this.departamentoId });
    }
  }
  
  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.runningTask.set(true);

    this.municipioService.create(this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}
