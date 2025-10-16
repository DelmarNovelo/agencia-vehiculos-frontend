import { PrecioVenta } from "../interfaces/precio-venta.interface";

export type CrearPrecioVentaDto = Pick<PrecioVenta, 'precioBase' | 'vigenteDesde'>;