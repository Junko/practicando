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
    console.log('No-Auth Guard - BLOQUEADO - Redirigiendo a home');
    utilsSvc.routerLink('/home');
    return false;
  }
};
