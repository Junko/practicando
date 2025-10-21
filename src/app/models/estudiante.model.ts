import { NivelEducativo } from './user.model';

// Enums para los grados específicos por nivel
export enum GradoInicial {
    TRES_ANOS = '3 años',
    CUATRO_ANOS = '4 años',
    CINCO_ANOS = '5 años'
}

export enum GradoPrimaria {
    PRIMERO = '1°',
    SEGUNDO = '2°',
    TERCERO = '3°',
    CUARTO = '4°',
    QUINTO = '5°',
    SEXTO = '6°'
}

export enum GradoSecundaria {
    PRIMERO = '1°',
    SEGUNDO = '2°',
    TERCERO = '3°',
    CUARTO = '4°',
    QUINTO = '5°'
}

export enum Seccion {
    A = 'A',
    B = 'B',
    C = 'C'
}

export interface Estudiante {
    id: string;
    nombres: string;
    apellidos: string;
    nivel: NivelEducativo;
    grado: string; // Cambiado a string para manejar los grados específicos
    seccion: Seccion;
    idPadre: string; // Referencia al UID del padre en Firebase
    creadoEn: Date;
}

// Interface para crear un nuevo estudiante (sin ID)
export interface CrearEstudiante {
    nombres: string;
    apellidos: string;
    nivel: NivelEducativo;
    grado: string;
    seccion: Seccion;
    idPadre: string;
}

// Interface para el formulario de datos del hijo
export interface FormularioHijo {
    nombres: string;
    apellidos: string;
    nivel: NivelEducativo;
    grado: string;
    seccion: Seccion;
}
