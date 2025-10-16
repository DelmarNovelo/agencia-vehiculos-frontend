import { Combustible } from "../interfaces/combustible.interface";

export type CombustibleListDto = Pick<Combustible, 'id' | 'nombre'>;