import { EstadoInspeccion } from './user.model';

export interface InspeccionAula {
    id: string;
    idAula: string; // Referencia al ID del aula
    idInventario: string; // Referencia al ítem del inventario esperado
    estado: EstadoInspeccion;
    motivoDanoFalta?: string; // Rellenable si estado != 'buen_estado'
    observaciones?: string;
    fechaInspeccion: Date;
    registradoPor: string; // Referencia al UID del usuario que registró
}

// Interface para crear una nueva inspección
export interface CrearInspeccionAula {
    idAula: string;
    idInventario: string;
    estado: EstadoInspeccion;
    motivoDanoFalta?: string;
    observaciones?: string;
    fechaInspeccion: Date;
    registradoPor: string;
}

// Interface para actualizar una inspección existente
export interface ActualizarInspeccionAula {
    estado?: EstadoInspeccion;
    motivoDanoFalta?: string;
    observaciones?: string;
}

// Interface para mostrar inspecciones con información completa
export interface InspeccionAulaCompleta extends InspeccionAula {
    nombreAula: string;
    tipoAula: string;
    nombreRecurso: string;
    tipoRecurso: string;
    cantidadEsperada: number;
    nombreRegistrador: string;
}

// Interface para reportes de inspección por aula
export interface ReporteInspeccionAula {
    idAula: string;
    nombreAula: string;
    tipoAula: string;
    fechaInspeccion: Date;
    totalItems: number;
    itemsBuenEstado: number;
    itemsFaltantes: number;
    itemsDanados: number;
    porcentajeBuenEstado: number;
    registradoPor: string;
    nombreRegistrador: string;
}
