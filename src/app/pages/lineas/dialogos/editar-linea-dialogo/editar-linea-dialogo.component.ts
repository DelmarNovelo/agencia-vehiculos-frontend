import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { LineaService } from '../../services/linea.service';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { MarcaService } from '../../../marcas/services/marca.service';
import { Select } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';
import { MarcaResponseDto } from '../../../marcas/dto/marca-response.dto';

@Component({
  selector: 'app-editar-linea-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    LoadingComponent,
    IftaLabel,
    InputText,
    Button,
    Select,
  ],
  templateUrl: './editar-linea-dialogo.component.html',
  styles: ``
})
export class EditarLineaDialogoComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private formBuilder = inject(NonNullableFormBuilder);
  private lineaService = inject(LineaService);
  private marcaService = inject(MarcaService);
  private lineaId = inject(DynamicDialogConfig).data;
  private dialogRef = inject(DynamicDialogRef<EditarLineaDialogoComponent>);

  lineaDetalles = this.lineaService.fetchOne(this.lineaId);
  marcas = this.marcaService.findAllForSelect();
  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    marcaId: this.formBuilder.control < number | null>(null, Validators.required),
    nombre: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.lineaDetalles.value()) {
        this.formGroup.patchValue(this.lineaDetalles.value()!);
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevaMarcaDialogo() {
    const dialogRef = this.marcaService.nuevaMarcaDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: MarcaResponseDto | null) => {
        if (response) {
          const { marcaId } = this.formGroup.controls;
          const { id, nombre } = response;

          this.marcas.update(currentValue => ([...currentValue, { id, nombre }]));
          marcaId.setValue(id, { emitEvent: false });
        }
      });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { id } = this.lineaDetalles.value()!;

    this.runningTask.set(true);

    this.lineaService.update(id, this.formGroup.getRawValue()).subscribe({
      next: response => this.dialogRef.close(response),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false),
    });
  }

  isFormControlInvalid(controlName: string) {
    return isFormControlInvalid(this.formGroup, controlName);
  }

}
