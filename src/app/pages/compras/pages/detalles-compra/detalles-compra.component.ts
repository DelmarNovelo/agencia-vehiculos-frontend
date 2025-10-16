import { Component, inject, input } from '@angular/core';
import { CompraService } from '../../services/compra.service';
import { Card } from 'primeng/card';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-detalles-compra',
  imports: [Card, Badge, Button, DatePipe, CurrencyPipe],
  templateUrl: './detalles-compra.component.html',
  styles: ``
})
export default class DetallesCompraComponent {

  private compraService = inject(CompraService);
  id = input<number>(0)

  detallesCompra = this.compraService.fetchOne(this.id);

}
