export interface UnidadVehicular {
  id: number;
  vin: string;
}

export interface Vehiculo {
  id: number;
  descripcion: string;
  color: string;
  combustible: string;
  transmision: string;
  tipoVehiculo: string;
  linea: string;
  modelo: string;
  marca: string;
  unidadesVehiculares: UnidadVehicular[];
}

export interface VehiculoEdit {
  id: number;
  descripcion: string;
  colorId: number;
  combustibleId: number;
  transmisionId: number;
  tipoVehiculoId: number;
  lineaId: number;
  modeloId: number;
  marcaId: number;
  precioVenta?: number;
}