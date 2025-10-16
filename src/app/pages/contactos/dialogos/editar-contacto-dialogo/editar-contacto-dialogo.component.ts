import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { ContactoService } from '../../services/contacto.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TipoContactoService } from '../../../tipos-contacto/services/tipo-contacto.service';
import { Select } from 'primeng/select';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { Subject, takeUntil } from 'rxjs';
import { TipoContacto } from '../../../tipos-contacto/interfaces/tipo-contacto.interface';

@Component({
  selector: 'app-editar-contacto-dialogo',
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormControlErrorComponent,
    LoadingComponent,
    Select,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './editar-contacto-dialogo.component.html',
  styles: ``
})
export class EditarContactoDialogoComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  private formBuilder = inject(NonNullableFormBuilder);
  private contactoService = inject(ContactoService);
  private tipoContactoService = inject(TipoContactoService);
  contactoId = inject(DynamicDialogConfig).data as number;
  private dialogRef = inject(DynamicDialogRef<EditarContactoDialogoComponent>);

  runningTask = signal(false);

  tiposContacto = this.tipoContactoService.fetchAllForSelect();
  detallesContacto = this.contactoService.fetchOne(this.contactoId,);

  formGroup = this.formBuilder.group({
    tipoContactoId: this.formBuilder.control<number | null>(null, Validators.required),
    valorContacto: this.formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      if (this.detallesContacto.value()) {
        this.formGroup.patchValue(this.detallesContacto.value());
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nuevoTipoContacto() {
    const dialogRef = this.tipoContactoService.nuevoTipoContactoDialogo();
    dialogRef.onClose.pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: TipoContacto) => {
        if (response) {
          const { id, nombre } = response;
          const { tipoContactoId } = this.formGroup.controls;
          tipoContactoId.setValue(id, { emitEvent: false });
          this.tiposContacto.update(currentValue => ([...currentValue, { id, nombre }]));
        }
      });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    this.runningTask.set(true);

    this.contactoService.update(this.contactoId, this.formGroup.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.runningTask.set(false),
      complete: () => this.runningTask.set(false),
    });
  }

  isFormControlInvalid(formControlName: string) {
    return isFormControlInvalid(this.formGroup, formControlName);
  }

}
