import { Rol } from "../interfaces/rol.interface";

export type RolForSelectDto = Pick<Rol, 'id' | 'nombre'>;