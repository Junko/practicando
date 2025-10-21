import { inject } from '@angular/core';
import { CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Utils } from '../services/utils';

export const padreGuard: CanActivateFn = (
  route: any,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  
  const utilsSvc = inject(Utils);
  
  const user = localStorage.getItem('user');
  
  if (user) {
    try {
      const userParsed = JSON.parse(user);
      
      if (userParsed.rol === 'padre') {
        console.log('Padre Guard - PERMITIDO - Usuario es padre');
        return true;
      } else {
        console.log('Padre Guard - BLOQUEADO - Usuario no es padre');
        utilsSvc.routerLink('/login');
        return false;
      }
    } catch (error) {
      console.error('Padre Guard - Error al parsear usuario:', error);
      utilsSvc.routerLink('/login');
      return false;
    }
  } else {
    console.log('Padre Guard - BLOQUEADO - No hay usuario en localStorage');
    utilsSvc.routerLink('/login');
    return false;
  }
};
