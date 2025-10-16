import { Modelo } from "../interfaces/modelo.interface";

export type ModeloListDto = Pick<Modelo, 'id' | 'nombre'>;