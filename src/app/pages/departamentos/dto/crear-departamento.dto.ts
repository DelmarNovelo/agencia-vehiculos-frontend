import { Departamento } from "../interfaces/departamento.interface";

export type CrearDepartamentoDto = Pick<Departamento, 'nombre'> & {
  municipios: string[];
};