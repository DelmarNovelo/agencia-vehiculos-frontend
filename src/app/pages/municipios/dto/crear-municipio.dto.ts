import { Municipio } from "../interfaces/municipio.interface";

export type CrearMunicipioDto = Pick<Municipio, 'nombre'> & { departamentoId: number };