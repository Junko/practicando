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
  
  let user = localStorage.getItem('user');
  
  console.log('Auth Guard - User localStorage:', user);
  
  // Verificación simple: si hay usuario en localStorage, permitir acceso
  if (user) {
    console.log('Auth Guard - PERMITIDO');
    return true;
  } else {
    console.log('Auth Guard - BLOQUEADO - Redirigiendo a login');
    utilsSvc.routerLink('/login');
    return false;
  }
};
