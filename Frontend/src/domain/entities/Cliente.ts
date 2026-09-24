/**
 * Domain Entity: Cliente
 */
export interface Cliente {
  id: number;
  negocio_id: number;
  nombre: string;
  telefono?: string;
  correo?: string;
  genero?: string;
  direccion?: string;
  activo: boolean;
  fecha_creacion: string;
}

export interface CreateClienteData {
  nombre: string;
  telefono?: string;
  correo?: string;
  genero?: string;
  direccion?: string;
}
