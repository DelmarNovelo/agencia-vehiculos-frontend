import { DireccionDetalles } from "../../direcciones/dto/direccion-detalles.dto";

export interface ProveedorDetalles {
  id: number;
  nit: string;
  razonSocial: string;
  direccion: DireccionDetalles;
}