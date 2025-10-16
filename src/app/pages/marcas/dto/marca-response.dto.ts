import { LineaForSelectDto } from "../../lineas/dto/linea-for-select.dto";
import { Marca } from "../interfaces/marca.interface";

export type MarcaResponseDto = Pick<Marca, 'id' | 'nombre'> & { lineas: LineaForSelectDto[] };