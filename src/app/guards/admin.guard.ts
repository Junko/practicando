import { inject } from '@angular/core';
import { CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Utils } from '../services/utils';

export const adminGuard: CanActivateFn = (
  route: any,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  
  const utilsSvc = inject(Utils);
  
  const user = localStorage.getItem('user');
  
  if (user) {
    try {
      const userParsed = JSON.parse(user);
      
      if (userParsed.rol === 'admin') {
        console.log('Admin Guard - PERMITIDO - Usuario es admin');
        return true;
      } else {
        console.log('Admin Guard - BLOQUEADO - Usuario no es admin');
        utilsSvc.routerLink('/login');
        return false;
      }
    } catch (error) {
      console.error('Admin Guard - Error al parsear usuario:', error);
      utilsSvc.routerLink('/login');
      return false;
    }
  } else {
    console.log('Admin Guard - BLOQUEADO - No hay usuario en localStorage');
    utilsSvc.routerLink('/login');
    return false;
  }
};
