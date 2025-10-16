import { Rol } from "../interfaces/rol.interface";

export type RolDto = Pick<Rol, 'id' | 'nombre' | 'descripcion' | 'canBeDeleted'>;