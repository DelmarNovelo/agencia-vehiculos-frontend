import { AbstractControl, FormControl, FormGroup } from "@angular/forms";

export function isFormControlInvalid(formGroup: FormGroup, formControlName: string) {
  const formControl = formGroup.controls[formControlName] as FormControl;
  return formControl.invalid && formControl.touched;
}

export function markFormGroupAsDirty(formGroup: FormGroup) {
  formGroup.markAllAsTouched();

  for (const key in formGroup.controls) {
    if (Object.prototype.hasOwnProperty.call(formGroup.controls, key)) {
      const element: AbstractControl = formGroup.controls[key as keyof {}];
      element.markAsDirty();
    }
  }
}