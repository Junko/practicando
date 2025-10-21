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
  
  console.log('=== AUTH GUARD ===');
  console.log('Ruta solicitada:', state.url);
  console.log('User localStorage:', user);
  console.log('User parseado:', user ? JSON.parse(user) : null);
  
  // Verificación simple: si hay usuario en localStorage, permitir acceso
  if (user) {
    console.log('Auth Guard - PERMITIDO - Usuario encontrado en localStorage');
    return true;
  } else {
    console.log('Auth Guard - BLOQUEADO - No hay usuario en localStorage');
    console.log('Redirigiendo a /login...');
    utilsSvc.routerLink('/login');
    return false;
  }
};
