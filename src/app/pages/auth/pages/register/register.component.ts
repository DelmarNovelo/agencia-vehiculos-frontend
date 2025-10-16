import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormControlErrorComponent,
    Card,
    InputText,
    IftaLabel,
    Button,
  ],
  templateUrl: './register.component.html',
  styles: ``
})
export default class RegisterComponent {

  private formBuilder = inject(NonNullableFormBuilder);

  formGroup = this.formBuilder.group({
    nombre: this.formBuilder.control('', Validators.required),
    apellido: this.formBuilder.control('', Validators.required),
    email: this.formBuilder.control('', Validators.required),
    password: this.formBuilder.control('', Validators.required),
  });

  isFormControlInvalid(formControlName: string) {
    return isFormControlInvalid(this.formGroup, formControlName);
  }

}
