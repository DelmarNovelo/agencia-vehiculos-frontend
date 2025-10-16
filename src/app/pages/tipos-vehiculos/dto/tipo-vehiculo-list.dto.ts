import { TipoVehiculo } from "../interfaces/tipo-vehiculo.interface";

export type TipoVehiculoListDto = Pick<TipoVehiculo, 'id' | 'nombre'>;