export interface ListaVenta {
  id: number;
  fecha: Date;
  total: number;
  tipoVenta: string;
  metodoPago: string;
  nombreCliente: string;
}