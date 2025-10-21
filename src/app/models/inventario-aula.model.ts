import { TipoRecurso } from './user.model';

export interface InventarioAula {
    id: string;
    idAula: string; // Referencia al ID del aula
    tipoRecurso: TipoRecurso;
    nombreRecurso: string; // Ej: "Silla", "Computadora"
    cantidadEsperada: number;
}

// Interface para crear un nuevo ítem de inventario
export interface CrearInventarioAula {
    idAula: string;
    tipoRecurso: TipoRecurso;
    nombreRecurso: string;
    cantidadEsperada: number;
}

// Interface para actualizar la cantidad esperada
export interface ActualizarInventarioAula {
    cantidadEsperada: number;
}
