import { Rol } from "../interfaces/rol.interface";

export type RolDetallesDto = Pick<Rol, 'id' | 'nombre' | 'descripcion' | 'canBeDeleted'> & { permisos: number[] };