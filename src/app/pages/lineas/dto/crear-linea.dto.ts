import { Linea } from "../interfaces/linea.interface";

export type CrearLineaDto = Pick<Linea, 'nombre'> & { marcaId: number };