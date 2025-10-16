import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DireccionService } from '../../services/direccion.service';
import { DepartamentoService } from '../../../departamentos/services/departamento.service';
import { MunicipioService } from '../../../municipios/services/municipio.service';
import { NgIf } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { IftaLabel } from 'primeng/iftalabel';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-editar-direccion-dialogo',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormControlErrorComponent,
    LoadingComponent,
    Select,
    InputText,
    IftaLabel,
    Button,
  ],
  templateUrl: './editar-direccion-dialogo.component.html',
  styles: ``
})
export class EditarDireccionDialogoComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private formBuilder = inject(NonNullableFormBuilder);
  private departamentoService = inject(DepartamentoService);
  private municipioService = inject(MunicipioService);
  private direccionService = inject(DireccionService);
  private direccionId = inject(DynamicDialogConfig).data as number;
  private dialogRef = inject(DynamicDialogRef<EditarDireccionDialogoComponent>);

  departamentoId = signal(0);
  runningTask = signal(false);

  departamentos = this.departamentoService.fetchAllForSelect();
  municipios = this.municipioService.fetchAllForSelect(this.departamentoId);
  detallesDireccion = this.direccionService.fetchOne(this.direccionId);

  formGroup = this.formBuilder.group({
    calle: this.formBuilder.control('', Validators.required),
    departamentoId: this.formBuilder.control<number | null>(null, Validators.required),
    municipioId: this.formBuilder.control<number | null>(null, Validators.required),
  });

  constructor() {
    effect(() => {
      const deptId = this.departamentoId();
      if (deptId > 0) {
        this.municipios.reload();
      }
    });

    effect(() => {
      if (this.detallesDireccion.value()) {
        const direccion = this.detallesDireccion.value()!;
        this.departamentoId.set(direccion.departamentoId);

        this.formGroup.patchValue({
          calle: direccion.calle,
          departamentoId: direccion.departamentoId,
          municipioId: direccion.municipioId
        });
      }
    });
  }

  ngOnInit(): void {
    this.formValueChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  formValueChanges() {
    const { departamentoId, municipioId } = this.formGroup.controls;

    departamentoId.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        if (this.detallesDireccion.value() && value !== this.detallesDireccion.value()?.departamentoId) {
          municipioId.reset();
        }
        this.departamentoId.set(value!);
        municipioId.setValidators([Validators.required]);
        municipioId.updateValueAndValidity();
      });
  }


  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.runningTask.set(true);

    this.direccionService.update(this.direccionId, this.formGroup.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

  nuevoDepartamento() {
    const dialogRef = this.departamentoService.crearDepartamentoDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        if (res) {
          const { id, nombre, municipios } = res;
          const { departamentoId, municipioId } = this.formGroup.controls;
          municipioId.reset();
          departamentoId.setValue(id, { emitEvent: false });
          this.departamentos.update(currentValue => ([...currentValue, { id, nombre }]));
          this.municipios.set(municipios);
        }
      });
  }

  nuevoMunicipio() {
    const dialogRef = this.municipioService.crearMunicipioDialogo(this.departamentoId());
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        if (res) {
          const { id, nombre } = res;
          const { municipioId } = this.formGroup.controls;
          municipioId.setValue(id, { emitEvent: false });
          this.municipios.update(currentValue => ([...currentValue, { id, nombre }]));
        }
      });
  }

  isFormControlInvalid(controlName: string) {
    return isFormControlInvalid(this.formGroup, controlName);
  }

}
