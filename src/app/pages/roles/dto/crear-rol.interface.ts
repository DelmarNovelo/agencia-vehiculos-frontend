import { Rol } from "../interfaces/rol.interface";

export type CrearRolDto = Pick<Rol, 'nombre' | 'descripcion'> & { permisos: number[] };