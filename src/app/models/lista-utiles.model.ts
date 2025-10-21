import { NivelEducativo } from './user.model';

export interface ListaUtiles {
    id: string;
    nivel: NivelEducativo;
    grado: number;
    anio: number;
    nombreLista: string;
}

// Interface para crear una nueva lista de útiles
export interface CrearListaUtiles {
    nivel: NivelEducativo;
    grado: number;
    anio: number;
    nombreLista: string;
}

// Interface para actualizar una lista existente
export interface ActualizarListaUtiles {
    nombreLista?: string;
    anio?: number;
}
