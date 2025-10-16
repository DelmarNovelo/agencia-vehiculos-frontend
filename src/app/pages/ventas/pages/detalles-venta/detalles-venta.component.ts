import { Component, inject, input } from '@angular/core';
import { VentaService } from '../../services/venta.service';
import { Card } from 'primeng/card';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PdfService } from '../../../../services/pdf.service';

@Component({
  selector: 'app-detalles-venta',
  imports: [
    Card, 
    Badge, 
    Button, 
    DatePipe, 
    CurrencyPipe,
  ],
  templateUrl: './detalles-venta.component.html',
  styles: ``
})
export default class DetallesVentaComponent {

  private ventaService = inject(VentaService);
  private pdfService = inject(PdfService);
  
  id = input<number>(0)
  
  detallesVenta = this.ventaService.fetchOne(this.id);
  
  descargarPdf() {
    if (this.id() > 0) {
      this.pdfService.getPdfVenta(this.id()).subscribe({
        next: (pdfBlob: Blob) => {
          const url = window.URL.createObjectURL(pdfBlob);
          window.open(url, '_blank');
        },
        error: (error) => {
          console.error('Error al descargar PDF:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    }
  }
  
}
