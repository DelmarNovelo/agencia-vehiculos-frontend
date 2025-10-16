import { ContactoDetalles } from "../../contactos/dto/contacto-detalles.dto";

export interface ContactoProveedorDetalles {
  id: number;
  personaId: number;
  cargo: string;
  nombreContacto: string;
  contactos: ContactoDetalles[];
}
