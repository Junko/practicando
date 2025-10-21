export interface Verificacion {
    id: string;
    idEstudiante: string; // Referencia al ID del estudiante
    idItem: string; // Referencia al ID del ítem de la lista
    entregado: boolean;
    fechaVerificacion: Date;
}

// Interface para crear una nueva verificación
export interface CrearVerificacion {
    idEstudiante: string;
    idItem: string;
    entregado: boolean;
}

// Interface para actualizar el estado de entrega
export interface ActualizarVerificacion {
    entregado: boolean;
}

// Interface para mostrar verificaciones con información completa
export interface VerificacionCompleta extends Verificacion {
    nombreEstudiante: string;
    nombreMaterial: string;
    cantidad: number;
    nombreLista: string;
    nivel: string;
    grado: number;
}

// Interface para reportes de verificación por estudiante
export interface ReporteVerificacionEstudiante {
    idEstudiante: string;
    nombreEstudiante: string;
    nivel: string;
    grado: number;
    seccion: string;
    totalItems: number;
    itemsEntregados: number;
    itemsPendientes: number;
    porcentajeCompletado: number;
    fechaUltimaVerificacion?: Date;
}
