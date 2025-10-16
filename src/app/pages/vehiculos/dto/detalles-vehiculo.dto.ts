import { Vehiculo } from "../interfaces/vehiculo.interface";

export type DetallesVehiculoDto = Vehiculo & { precioVenta: number, precioVentaId: number };