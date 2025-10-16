import { CrearUnidadVehicularDto } from "../../unidades-vehiculares/dto/crear-unidad-vehicular.dto";

export interface VehiculoForm {
  marcaId: number;
  lineaId: number;
  modeloId: number;
  colorId: number;
  combustibleId: number;
  transmisionId: number;
  tipoVehiculoId: number;
  precioVenta: number;
  descripcion: string;
  unidades?: CrearUnidadVehicularDto[];
}