import { TabsConfig } from '../models/tab-config.model';

// Configuración de tabs para usuarios Admin
export const ADMIN_TABS_CONFIG: TabsConfig = {
  tabs: [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: 'home-outline',
      route: '/admin/inicio'
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: 'people-outline',
      route: '/admin/usuarios-crud'
    },
    {
      id: 'listas',
      label: 'Listas',
      icon: 'list-outline',
      route: '/admin/listas-crud'
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: 'bar-chart-outline',
      route: '/admin/reportes'
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
      icon: 'home-outline',
      route: '/padre/inicio'
    },
    {
      id: 'listas',
      label: 'Lista',
      icon: 'library-outline',
      route: '/padre/listas'
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: 'notifications-outline',
      route: '/padre/notificaciones'
    },
    {
      id: 'perfil',
      label: 'Perfil',
      icon: 'person-circle-outline',
      route: '/padre/perfil'
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
