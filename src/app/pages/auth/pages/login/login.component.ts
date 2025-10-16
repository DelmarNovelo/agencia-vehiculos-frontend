import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { IftaLabel } from 'primeng/iftalabel';
import { Router, RouterLink } from '@angular/router';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormControlErrorComponent,
    Card,
    InputText,
    IftaLabel,
    Button,
  ],
  templateUrl: './login.component.html',
  styles: ``
})
export default class LoginComponent {

  private router = inject(Router);
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);

  showPassword = signal(false);
  runningTask = signal(false);

  formGroup = this.formBuilder.group({
    email: this.formBuilder.control('', Validators.required),
    password: this.formBuilder.control('', Validators.required),
  });

  isFormControlInvalid(formControlName: string) {
    return isFormControlInvalid(this.formGroup, formControlName);
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.runningTask.set(true);

    this.authService.login(this.formGroup.getRawValue()).subscribe({
      next: () => this.router.navigate(['/panel/']),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false)
    });
  }

}
