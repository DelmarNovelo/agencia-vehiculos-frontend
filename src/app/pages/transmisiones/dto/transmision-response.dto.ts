import { Transmision } from "../interfaces/transmision.interface";

export type TransmisionResponseDto = Pick<Transmision, 'id' | 'nombre'>;