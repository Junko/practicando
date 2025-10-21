import { NivelEducativo, TipoAula } from './user.model';

export interface Aula {
    id: string;
    nombreAula: string;
    tipoAula: TipoAula;
    
    // Solo para aulas REGULARES
    nivel?: NivelEducativo;
    grado?: number;
    seccion?: string;
    
    creadoEn: Date;
}

// Interface para crear una nueva aula
export interface CrearAula {
    nombreAula: string;
    tipoAula: TipoAula;
    nivel?: NivelEducativo;
    grado?: number;
    seccion?: string;
}

// Interface para aulas regulares (con validación de campos requeridos)
export interface AulaRegular extends Aula {
    tipoAula: TipoAula.REGULAR;
    nivel: NivelEducativo;
    grado: number;
    seccion: string;
}

// Interface para aulas compartidas
export interface AulaCompartida extends Aula {
    tipoAula: TipoAula.COMPARTIDO;
    nivel?: never;
    grado?: never;
    seccion?: never;
}
