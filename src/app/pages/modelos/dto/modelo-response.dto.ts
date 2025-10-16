import { Modelo } from "../interfaces/modelo.interface";

export type ModeloResponseDto = Pick<Modelo, 'id' | 'nombre'>;