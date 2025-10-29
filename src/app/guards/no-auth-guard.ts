import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Firebase } from '../services/firebase';
import { Utils } from '../services/utils';

export const noAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  
  const utilsSvc = inject(Utils);
  let user = localStorage.getItem('user');
  
  console.log('No-Auth Guard - User localStorage:', user);
  
  // Si NO hay usuario en localStorage, permitir acceso
  if (!user) {
    console.log('No-Auth Guard - PERMITIDO (no autenticado)');
    return true;
  } else {
    console.log('No-Auth Guard - BLOQUEADO - Redirigiendo según rol');
    
    try {
      const userData = JSON.parse(user);
      const userRole = userData.rol || userData.role;
      
      // Redirigir según el rol del usuario
      if (userRole === 'padre') {
        window.location.href = '/padre/inicio';
      } else if (userRole === 'admin') {
        window.location.href = '/admin/inicio';
      } else {
        // Rol no reconocido, redirigir a admin por defecto
        window.location.href = '/admin/inicio';
      }
    } catch (error) {
      console.error('Error al parsear datos del usuario:', error);
      // En caso de error, redirigir a admin por defecto
      window.location.href = '/admin/inicio';
    }
    
    return false;
  }
};
