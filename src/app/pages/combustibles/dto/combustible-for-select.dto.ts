import { Combustible } from "../interfaces/combustible.interface";

export type CombustibleForSelectDto = Pick<Combustible, 'id' | 'nombre'>;