import { DireccionDetalles } from "../../direcciones/dto/direccion-detalles.dto";
import { EmpresaDto } from "./empresa.dto";

export type ResumenTransaccionDto = {
  totalItems: number;
  totalAmount: number;
}

export interface ResumenEmpresa {
  empresa: EmpresaDto;
  direccion: DireccionDetalles;
  clientes: number;
  proveedores: number;
  vehiculos: number;
  ventas: ResumenTransaccionDto;
  compras: ResumenTransaccionDto;
}