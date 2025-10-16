export interface CrearClienteDto {
  nombre: string;
  apellido: string;
  dpi?: string;
  nit?: string;
  sucursalId: number;
  direccion?: CrearDireccionDto;
  contactos?: CrearContactoDto[];
}

export interface CrearDireccionDto {
  calle: string;
  municipioId: number;
}

export interface CrearContactoDto {
  valorContacto: string;
  tipoContactoId: number;
}