import { NgFor, NgIf } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { IftaLabel } from "primeng/iftalabel";
import { isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { EmptyMessageComponent } from '../../../../shared/components/empty-message/empty-message.component';

@Component({
  selector: 'app-unidades-vehiculares-form',
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    EmptyMessageComponent,
    FormControlErrorComponent,
    InputText,
    Button,
    IftaLabel
  ],
  templateUrl: './unidades-vehiculares-form.component.html',
  styles: ``
})
export class UnidadesVehicularesFormComponent {

  private formBuilder = inject(NonNullableFormBuilder);

  unidadesFormGroup = input.required<FormGroup<any>>();

  onValueChanges$ = output<any>({ alias: 'onValueChanges' });

  createFormGroup() {
    return this.formBuilder.group({
      vin: this.formBuilder.control('', Validators.required),
    });
  }

  addFormGroup() {
    this.unidadesFormArray.push(this.createFormGroup());
  }

  removeFormGroup(index: number) {
    this.unidadesFormArray.removeAt(index);
  }

  get unidadesFormArray() {
    return this.unidadesFormGroup().get('unidades') as FormArray;
  }

  isFormControlInvalid(formControlName: string, index: number) {
    const formGroup = this.unidadesFormArray.at(index) as FormGroup;
    return isFormControlInvalid(formGroup, formControlName);
  }
}
