import { NgFor, NgIf } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { FormControlErrorComponent } from '../../../../shared/components/form-control-error/form-control-error.component';
import { isFormControlInvalid, markFormGroupAsDirty } from '../../../../common/functions/form-group.helper';
import { CrearMarcaDto } from '../../dto/crear-marca.dto';
import { MarcaService } from '../../services/marca.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-nueva-marca',
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    FormControlErrorComponent,
    InputText,
    Button,
    IftaLabel,
    ContextMenu,
  ],
  templateUrl: './nueva-marca.component.html',
  styles: ``
})
export class NuevaMarcaComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private marcaService = inject(MarcaService);
  private dialogRef = inject(DynamicDialogRef<NuevaMarcaComponent>);

  selectedIndexMenu = signal<number | null>(null); // Indica donde mostrar el menu
  menuItems: MenuItem[] = [
    {
      label: 'Remover línea',
      icon: 'pi pi-trash',
      class: 'text-red-500',
      // command: () => this.removerLinea()
    }
  ];

  formGroup = this.formBuilder.group({
    nombreMarca: this.formBuilder.control('', Validators.required),
    lineas: this.formBuilder.array([]),
  });

  contextMenu = viewChild.required<ContextMenu>(ContextMenu);

  onSubmit() {
    if (this.formGroup.invalid) {
      markFormGroupAsDirty(this.formGroup);
      return;
    }

    const { nombreMarca, lineas } = this.formGroup.getRawValue();

    const nuevaMarcaDto: CrearMarcaDto = {
      nombre: nombreMarca,
      lineas: lineas.map((linea: any) => linea.nombreLinea),
    }

    this.marcaService.crearMarca(nuevaMarcaDto).subscribe({
      next: response => this.dialogRef.close(response),
    });
  }

  onContextMenu(event: any, index: number) {
    this.contextMenu().target = event.currentTarget;
    this.contextMenu().show(event);
    this.selectedIndexMenu.set(index);
  }

  crearLineaFormGroup() {
    return this.formBuilder.group({
      nombreLinea: this.formBuilder.control('', Validators.required),
    });
  }

  agregarLinea() {
    this.lineaFormArray.push(this.crearLineaFormGroup());
  }

  removerLinea(index: number) {
    this.lineaFormArray.removeAt(index);
  }

  get lineaFormArray() {
    return this.formGroup.controls.lineas as FormArray;
  }

  get marcaError() {
    const { nombreMarca } = this.formGroup.controls;
    return nombreMarca.invalid && nombreMarca.touched;
  }

  getFormControlError(formControlName: string, index: number) {
    const formGroup = this.lineaFormArray.at(index) as FormGroup;
    return isFormControlInvalid(formGroup, formControlName);
  }
}
