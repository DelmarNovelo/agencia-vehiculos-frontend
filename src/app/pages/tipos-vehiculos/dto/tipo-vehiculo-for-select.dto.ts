import { TipoVehiculo } from "../interfaces/tipo-vehiculo.interface";

export type TipoVehiculoForSelectDto = Pick<TipoVehiculo, 'id' | 'nombre'>;