import { Departamento } from "../interfaces/departamento.interface";

export type UpdateDepartamentoDto = Pick<Departamento, 'nombre'>;