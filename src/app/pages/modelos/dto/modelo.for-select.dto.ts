import { Modelo } from "../interfaces/modelo.interface";

export type ModeloForSelectDto = Pick<Modelo, 'id' | 'nombre'>;