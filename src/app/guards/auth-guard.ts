import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Firebase } from '../services/firebase';
import { Utils } from '../services/utils';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  
  const firebaseSvc = inject(Firebase);
  const utilsSvc = inject(Utils);
  
  // Función para limpiar localStorage si hay problemas
  const clearCorruptedStorage = () => {
    console.log('Limpiando localStorage corrupto...');
    localStorage.removeItem('user');
    // También limpiar otros datos relacionados si existen
    localStorage.removeItem('authToken');
    localStorage.removeItem('session');
  };
  
  // Función para verificar si localStorage está disponible
  const isLocalStorageAvailable = () => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.error('localStorage no disponible:', e);
      return false;
    }
  };
  
  // Verificación simple y directa
  const user = localStorage.getItem('user');
  
  console.log('=== AUTH GUARD ===');
  console.log('Ruta solicitada:', state.url);
  console.log('Usuario encontrado:', !!user);
  
  if (user) {
    try {
      const userParsed = JSON.parse(user);
      if (userParsed.uid && userParsed.correo) {
        console.log('Auth Guard - PERMITIDO');
        return true;
      }
    } catch (error) {
      console.error('Error al parsear usuario:', error);
    }
  }
  
  console.log('Auth Guard - BLOQUEADO - Redirigiendo a login');
  window.location.href = '/login';
  return false;
};
