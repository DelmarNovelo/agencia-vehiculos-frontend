import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InformeService } from './services/informe.service';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-informes',
  imports: [CommonModule, FormsModule, CalendarModule, ButtonModule, ReactiveFormsModule, DatePicker],
  templateUrl: './informes.component.html',
  styles: ``
})
export default class InformesComponent implements OnInit {

  formBuilder = inject(NonNullableFormBuilder);

  formGroup = this.formBuilder.group({
    startDate: this.formBuilder.control('', Validators.required),
    endDate: this.formBuilder.control('', Validators.required)
  });

  startDate: string = '';
  endDate: string = '';
  salesReport: any = null;
  topClient: any = null;
  profitMargin: any = null;

  constructor(private informeService: InformeService) { }

  ngOnInit(): void { }

  generateReports() {
    if (this.formGroup.valid) {
      this.getSalesReport();
      this.getTopClient();
      this.getProfitMargin();
    }
  }

  getSalesReport() {
    const { startDate, endDate } = this.formGroup.getRawValue();

    this.informeService.getSalesReport(startDate, endDate).subscribe(data => {
      this.salesReport = data;
    });
  }

  getTopClient() {
    const { startDate, endDate } = this.formGroup.getRawValue();

    this.informeService.getTopClient(startDate, endDate).subscribe(data => {
      this.topClient = data;
    });
  }

  getProfitMargin() {
    const { startDate, endDate } = this.formGroup.getRawValue();

    this.informeService.getProfitMargin(startDate, endDate).subscribe(data => {
      this.profitMargin = data;
    });
  }
}
