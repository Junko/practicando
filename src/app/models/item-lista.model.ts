export interface ItemLista {
    id: string;
    idLista: string; // Referencia al ID de la lista de útiles
    nombreMaterial: string;
    cantidad: number;
}

// Interface para crear un nuevo ítem de lista
export interface CrearItemLista {
    idLista: string;
    nombreMaterial: string;
    cantidad: number;
}

// Interface para actualizar un ítem existente
export interface ActualizarItemLista {
    nombreMaterial?: string;
    cantidad?: number;
}

// Interface para mostrar ítems con información de la lista
export interface ItemListaCompleto extends ItemLista {
    nombreLista: string;
    nivel: string;
    grado: number;
    anio: number;
}
