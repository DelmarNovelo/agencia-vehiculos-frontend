import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Form, FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TipoContactoService } from '../../../tipos-contacto/services/tipo-contacto.service';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { Subject, takeUntil } from 'rxjs';
import { TipoContacto } from '../../../tipos-contacto/interfaces/tipo-contacto.interface';

@Component({
  selector: 'app-contacto-form',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    IftaLabel,
    Select,
    InputText,
    Button,
  ],
  templateUrl: './contacto-form.component.html',
  styles: ``
})
export class ContactoFormComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private formBuilder = inject(NonNullableFormBuilder);
  private tipoContactoService = inject(TipoContactoService);

  tiposContacto = this.tipoContactoService.fetchAllForSelect();

  formGroup = input.required<FormGroup<{ contactos: FormArray<any> }>>();

  ngOnInit(): void {
    this.agregarContactoFormGroup();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevoTipoContacto(index: number) {
    const dialogRef = this.tipoContactoService.nuevoTipoContactoDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: TipoContacto) => {
        if (response) {
          const { id, nombre } = response;
          const formGroup = this.contactosFormArray.at(index) as FormGroup;
          const tipoContactoId = formGroup.controls['tipoContactoId'];
          tipoContactoId.setValue(id, { emitEvent: false });
          this.tiposContacto.update(currentValue => ([...currentValue, { id, nombre }]));
        }
      });
  }

  crearContactoFormGroup() {
    return this.formBuilder.group({
      tipoContactoId: this.formBuilder.control<number | null>(null, Validators.required),
      valorContacto: this.formBuilder.control('', Validators.required),
    });
  }

  agregarContactoFormGroup() {
    this.contactosFormArray.push(this.crearContactoFormGroup());
  }

  removerContactoFormGroup(index: number) {
    this.contactosFormArray.removeAt(index);
  }

  get contactosFormArray() {
    return this.formGroup().controls.contactos as FormArray;
  }

  isFormControlInvalid(index: number, formControlName: string) {
    const formGroup = this.formGroup().controls.contactos.at(index) as FormGroup;
    return isFormControlInvalid(formGroup, formControlName);
  }
}
