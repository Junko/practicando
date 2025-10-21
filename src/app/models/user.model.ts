export interface User {
    uid: string;
    nombres: string;
    apellidos: string;
    correo: string;
    contrasena: string;
    rol: 'padre' | 'admin';
    telefono?: string;
    creadoEn: Date;
}

// Enums para mejor tipado
export enum RolUsuario {
    PADRE = 'padre',
    ADMIN = 'admin'
}

export enum NivelEducativo {
    INICIAL = 'Inicial',
    PRIMARIA = 'Primaria',
    SECUNDARIA = 'Secundaria'
}

export enum TipoAula {
    REGULAR = 'regular',
    COMPARTIDO = 'compartido'
}

export enum TipoRecurso {
    MUEBLE = 'mueble',
    EQUIPO = 'equipo'
}

export enum EstadoInspeccion {
    BUEN_ESTADO = 'buen_estado',
    FALTANTE = 'faltante',
    DANADO = 'danado'
}

// Interfaces adicionales para diferentes casos de uso
export interface CrearUsuario {
    nombres: string;
    apellidos: string;
    correo: string;
    contrasena: string;
    rol: 'padre' | 'admin';
    telefono?: string;
}

export interface EditarUsuario {
    nombres: string;
    apellidos: string;
    correo: string;
    telefono?: string;
    rol: 'padre' | 'admin';
}

export interface LoginUsuario {
    correo: string;
    contrasena: string;
}

// Interface para mostrar usuario SIN contraseña (para seguridad)
export interface UsuarioPublico {
    uid: string;
    nombres: string;
    apellidos: string;
    correo: string;
    rol: 'padre' | 'admin';
    telefono?: string;
    creadoEn: Date;
}