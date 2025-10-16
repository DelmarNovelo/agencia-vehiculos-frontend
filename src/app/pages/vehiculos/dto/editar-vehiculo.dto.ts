import { CrearVehiculoDto } from "./crear-vehiculo.dto";

export type EditarVehiculoDto = Omit<CrearVehiculoDto, 'precioVenta' | 'unidades'>;