import { Component, effect, inject, signal } from '@angular/core';
import { MarcaService } from '../../services/marca.service';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-editar-marca-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    LoadingComponent,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './editar-marca-dialogo.component.html',
  styles: ``
})
export class EditarMarcaDialogoComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private marcaService = inject(MarcaService);
  private marcaId = inject(DynamicDialogConfig).data;
  private dialogRef = inject(DynamicDialogRef<EditarMarcaDialogoComponent>);

  marcaDetalles = this.marcaService.fetchOne(this.marcaId);
  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.marcaDetalles.value()) {
        this.formGroup.patchValue(this.marcaDetalles.value()!);
      }
    })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { id } = this.marcaDetalles.value()!;

    this.runningTask.set(true);
    
    this.marcaService.update(id, this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false),
    });
  }

  get isFormControlInvalid() {
    return isFormControlInvalid(this.formGroup, 'nombre');
  }

}
