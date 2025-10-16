import { Component, inject, OnDestroy, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { LineaService } from '../../services/linea.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { CrearLineaDto } from '../../dto/crear-linea.dto';
import { MarcaService } from '../../../marcas/services/marca.service';
import { Select } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';
import { MarcaResponseDto } from '../../../marcas/dto/marca-response.dto';

@Component({
  selector: 'app-crear-linea',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    InputText,
    Button,
    IftaLabel,
    Select,
  ],
  templateUrl: './crear-linea.component.html',
  styles: ``
})
export class CrearLineaComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private formBuilder = inject(NonNullableFormBuilder);
  private lineaService = inject(LineaService);
  private marcaService = inject(MarcaService);
  private dialogRef = inject(DynamicDialogRef<CrearLineaComponent>);
  private marcaId = inject(DynamicDialogConfig).data as number | undefined;

  runningTask = signal(false);
  
  marcas = this.marcaService.findAllForSelect();

  formGroup = this.formBuilder.group({
    marcaId: this.formBuilder.control(this.marcaId, Validators.required),
    nombre: this.formBuilder.control('', Validators.required),
  });

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

    const { nombre, marcaId } = this.formGroup.getRawValue();
    
    const body: CrearLineaDto = {
      nombre,
      marcaId: marcaId!,
    }

    this.runningTask.set(true);
    
    this.lineaService.create(body).subscribe({
      next: response => this.dialogRef.close(response),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false),
    });
  }

  isFormControlInvalid(controlName: string) {
    return isFormControlInvalid(this.formGroup, controlName);
  }

}
