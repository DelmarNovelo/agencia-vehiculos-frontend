import { Component, inject } from '@angular/core';
import { TransmisionService } from '../../services/transmision.service';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';

@Component({
  selector: 'app-crear-transmision-dialogo',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './crear-transmision-dialogo.component.html',
  styles: ``
})
export class CrearTransmisionDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private transmisionService = inject(TransmisionService);
  private dialogRef = inject(DynamicDialogRef<CrearTransmisionDialogoComponent>);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.transmisionService.create(this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}
