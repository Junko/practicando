import { MenuConfig } from '../models/menu-config.model';

// Configuración de menú para usuarios Admin
export const ADMIN_MENU_CONFIG: MenuConfig = {
  menuId: 'admin-menu',
  title: 'Menú Admin',
  items: [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: 'home-outline',
      route: '/admin/inicio'
    },
    {
      id: 'usuarios',
      label: 'Gestionar Usuarios',
      icon: 'people-outline',
      route: '/usuarios-crud'
    },
    {
      id: 'listas',
      label: 'Gestionar Listas',
      icon: 'list-outline',
      route: '/listas-crud'
    },
    {
      id: 'salones',
      label: 'Gestionar Salones',
      icon: 'business-outline',
      route: '/salones-crud'
    },
    {
      id: 'listas-cumplidas',
      label: 'Listas Cumplidas',
      icon: 'checkmark-circle-outline',
      route: '/listas-cumplidas'
    },
    {
      id: 'evaluar-salones',
      label: 'Evaluar Salones',
      icon: 'clipboard-outline',
      route: '/evaluar-salones'
    },
    {
      id: 'resumen-evaluacion',
      label: 'Resumen Evaluación',
      icon: 'analytics-outline',
      route: '/resumen-evaluacion'
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: 'person-outline',
      route: '/admin/perfil'
    },
    {
      id: 'logout',
      label: 'Cerrar Sesión',
      icon: 'log-out-outline',
      action: null // Se configurará dinámicamente
    }
  ]
};

// Configuración de menú para usuarios Padre
export const PADRE_MENU_CONFIG: MenuConfig = {
  menuId: 'padre-menu',
  title: 'Menú Padre',
  items: [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: 'home-outline',
      route: '/padre/inicio'
    },
    {
      id: 'hijos',
      label: 'Mis Hijos',
      icon: 'people-outline',
      route: '/padre/hijos'
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: 'notifications-outline',
      route: '/padre/notificaciones'
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: 'person-outline',
      route: '/padre/perfil'
    },
    {
      id: 'logout',
      label: 'Cerrar Sesión',
      icon: 'log-out-outline',
      action: null // Se configurará dinámicamente
    }
  ]
};
