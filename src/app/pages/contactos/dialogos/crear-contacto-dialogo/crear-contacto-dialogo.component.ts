import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { markFormGroupAsDirty, isFormControlInvalid } from '../../../../common/functions/form-group.helper';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { TipoContactoService } from '../../../tipos-contacto/services/tipo-contacto.service';
import { ContactoService } from '../../services/contacto.service';
import { Subject, takeUntil } from 'rxjs';
import { TipoContacto } from '../../../tipos-contacto/interfaces/tipo-contacto.interface';

interface DialogData {
  ownerId: number;
  ownerType: 'persona' | 'empresa';
}

@Component({
  selector: 'app-crear-contacto-dialogo',
  imports: [
    ReactiveFormsModule,
    FormControlErrorComponent,
    Select,
    IftaLabel,
    InputText,
    Button,
  ],
  templateUrl: './crear-contacto-dialogo.component.html',
  styles: ``
})
export class CrearContactoDialogoComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();
  
  private formBuilder = inject(NonNullableFormBuilder);
  private contactoService = inject(ContactoService);
  private tipoContactoService = inject(TipoContactoService);
  private dialogData = inject(DynamicDialogConfig).data as DialogData;
  private dialogRef = inject(DynamicDialogRef<CrearContactoDialogoComponent>);

  runningTask = signal(false);

  tiposContacto = this.tipoContactoService.fetchAllForSelect();

  formGroup = this.formBuilder.group({
    tipoContactoId: this.formBuilder.control<number | null>(null, Validators.required),
    valorContacto: this.formBuilder.control('', Validators.required),
  });

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

    this.contactoService.create({ ...this.formGroup.getRawValue(), ...this.dialogData })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.runningTask.set(false),
        complete: () => this.runningTask.set(false),
      });
  }

  isFormControlInvalid(formControlName: string) {
    return isFormControlInvalid(this.formGroup, formControlName);
  }

}
