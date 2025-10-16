import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { Button } from 'primeng/button';
import { isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { MunicipioService } from '../../../municipios/services/municipio.service';
import { DepartamentoService } from '../../../departamentos/services/departamento.service';
import { DepartamentoDialogoService } from '../../../departamentos/services/departamento-dialogo.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-direccion-form',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    IftaLabel,
    Button,
    InputText,
    Select,
  ],
  templateUrl: './direccion-form.component.html',
  styles: ``
})
export class DireccionFormComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  formGroup = input.required<FormGroup<{
    calle: FormControl<string>;
    departamentoId: FormControl<number | null>;
    municipioId: FormControl<number | null>;
  }>>();
  private departamentoDialogoService = inject(DepartamentoDialogoService);
  private departamentoService = inject(DepartamentoService);
  private municipioService = inject(MunicipioService);

  departamentoId = signal(0);

  departamentos = this.departamentoService.fetchAllForSelect();
  municipios = this.municipioService.fetchAllForSelect(this.departamentoId);

  ngOnInit(): void {
    this.formValueChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  formValueChanges() {
    const { departamentoId, municipioId } = this.formGroup().controls;

    departamentoId.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        municipioId.reset();
        this.departamentoId.set(value!);
        municipioId.setValidators([Validators.required]);
        municipioId.updateValueAndValidity();
      });
  }

  nuevoDepartamento() {
    const dialogRef = this.departamentoDialogoService.crearDepartamentoDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        if (res) {
          const { id, nombre, municipios } = res;
          const { departamentoId } = this.formGroup().controls;
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
          const { municipioId } = this.formGroup().controls;
          municipioId.setValue(id, { emitEvent: false });
          this.municipios.update(currentValue => ([...currentValue, { id, nombre }]));
        }
      });
  }

  isFormControlInvalid(formControlName: string) {
    return isFormControlInvalid(this.formGroup(), formControlName);
  }

}
