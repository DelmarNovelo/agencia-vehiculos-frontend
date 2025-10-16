import { Component, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { UnidadVehicularService } from '../../services/unidad-vehicular.service';
import { RadioButton } from 'primeng/radiobutton';
import { NgIf } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-editar-unidad-vehicular',
  imports: [
    NgIf,
    FormControlErrorComponent,
    ReactiveFormsModule,
    LoadingComponent,
    InputText,
    Button,
    IftaLabel,
    RadioButton,
  ],
  templateUrl: './editar-unidad-vehicular.component.html',
  styles: ``
})
export class EditarUnidadVehicularComponent {

  formBuilder = inject(NonNullableFormBuilder);
  private unidadVehicularService = inject(UnidadVehicularService);
  private unidadId = inject(DynamicDialogConfig).data as number;
  private dialogRef = inject(DynamicDialogRef<EditarUnidadVehicularComponent>);

  runningTask = signal(false);
  unidadVehicular = this.unidadVehicularService.fetchOne(this.unidadId);

  formGroup = this.formBuilder.group({
    disponible: this.formBuilder.control(false, Validators.required),
    vin: this.formBuilder.control('', Validators.required)
  });

  constructor() {
    effect(() => {
      if (this.unidadVehicular.value()) {
        this.formGroup.patchValue(this.unidadVehicular.value()!);
      }
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.runningTask.set(true);

    this.unidadVehicularService.updateUnidadVehicular(this.formGroup.value, this.unidadId).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'vin');
  }

}
