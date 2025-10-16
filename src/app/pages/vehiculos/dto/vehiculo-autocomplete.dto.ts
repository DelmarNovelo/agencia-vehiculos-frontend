import { Vehiculo } from "../interfaces/vehiculo.interface";

export type VehiculoAutocomplete = Pick<Vehiculo, 'id' | 'color' | 'combustible' | 'tipoVehiculo' | 'transmision'> &
{
  label: string,
  precioVenta: number,
};