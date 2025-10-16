import { Municipio } from "../../municipios/interfaces/municipio.interface";

export interface DepartamentoResponseDto {
  id: number;
  nombre: string;
  municipios: Municipio[];
}