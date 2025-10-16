import { Component, inject, signal } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { DepartamentoService } from '../../services/departamento.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CrearDepartamentoDto } from '../../dto/crear-departamento.dto';

@Component({
  selector: 'app-crear-departamento',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    InputText,
    Button,
    IftaLabel,
  ],
  templateUrl: './crear-departamento.component.html',
  styles: ``
})
export class CrearDepartamentoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private departamentoService = inject(DepartamentoService);
  private dialogRef = inject(DynamicDialogRef<CrearDepartamentoComponent>);

  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
    municipios: this.formBuilder.array([]),
  });

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { nombre, municipios } = this.formGroup.getRawValue();

    const crearDepartamentoDto: CrearDepartamentoDto = {
      nombre,
      municipios: municipios.map((municipio: any) => municipio.nombreMunicipio),
    }

    this.departamentoService.crearDepartamento(crearDepartamentoDto).subscribe({
      next: res => this.dialogRef.close(res),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  crearMunicipioFormGroup() {
    return this.formBuilder.group({
      nombreMunicipio: this.formBuilder.control('', Validators.required),
    });
  }

  agregarMunicipio() {
    this.municipioFormArray.push(this.crearMunicipioFormGroup());
  }

  removerMunicipio(index: number) {
    this.municipioFormArray.removeAt(index);
  }

  get municipioFormArray() {
    return this.formGroup.controls.municipios as FormArray;
  }

  isFormControlInvalid(formControlName: string) {
    return isFormControlInvalid(this.formGroup, formControlName);
  }

  getFormControlError(formControlName: string, index: number) {
    const formGroup = this.municipioFormArray.at(index) as FormGroup;
    return isFormControlInvalid(formGroup, formControlName);
  }
}
