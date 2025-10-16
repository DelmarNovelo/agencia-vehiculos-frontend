import { Marca } from "../interfaces/marca.interface";

export type MarcaForSelectDto = Pick<Marca, 'id' | 'nombre'>;