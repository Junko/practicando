import { TabsConfig } from '../models/tab-config.model';

// Configuración de tabs para usuarios Admin
export const ADMIN_TABS_CONFIG: TabsConfig = {
  tabs: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home',
      content: 'Panel de administración - Dashboard'
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: 'people',
      content: 'Gestión de usuarios del sistema'
    },
    {
      id: 'listas',
      label: 'Listas',
      icon: 'list',
      content: 'Gestión de listas de útiles escolares'
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: 'bar-chart',
      content: 'Reportes y estadísticas del sistema'
    }
  ],
  tabBarPosition: 'bottom',
  tabBarColor: 'primary'
};

// Configuración de tabs para usuarios Padre
export const PADRE_TABS_CONFIG: TabsConfig = {
  tabs: [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: 'home',
      content: 'Bienvenido al portal de padres'
    },
    {
      id: 'listas',
      label: 'Listas',
      icon: 'list',
      content: 'Listas de útiles escolares para sus hijos'
    },
    {
      id: 'hijos',
      label: 'Mis Hijos',
      icon: 'people',
      content: 'Información de sus hijos registrados'
    },
    {
      id: 'perfil',
      label: 'Perfil',
      icon: 'person',
      content: 'Configuración de su perfil de usuario'
    }
  ],
  tabBarPosition: 'bottom',
  tabBarColor: 'secondary'
};

// Configuración de tabs para usuarios Estudiante (futuro)
export const ESTUDIANTE_TABS_CONFIG: TabsConfig = {
  tabs: [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: 'home',
      content: 'Bienvenido al portal estudiantil'
    },
    {
      id: 'tareas',
      label: 'Tareas',
      icon: 'book',
      content: 'Tareas y actividades asignadas'
    },
    {
      id: 'calificaciones',
      label: 'Calificaciones',
      icon: 'school',
      content: 'Calificaciones y progreso académico'
    },
    {
      id: 'perfil',
      label: 'Perfil',
      icon: 'person',
      content: 'Configuración de perfil estudiantil'
    }
  ],
  tabBarPosition: 'bottom',
  tabBarColor: 'tertiary'
};
