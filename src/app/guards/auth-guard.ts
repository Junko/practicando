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

  return new Promise((resolve) => {
    firebaseSvc.auth.authState.subscribe((auth) => {
      console.log('Auth Guard - Auth state:', auth);
      console.log('Auth Guard - User in localStorage:', user);
      
      if (auth) {
        if (user) {
          console.log('Auth Guard - Usuario autenticado y con datos locales - PERMITIDO');
          resolve(true);
        } else {
          console.log('Auth Guard - Usuario autenticado pero sin datos locales - BLOQUEADO');
          utilsSvc.routerLink('/login');
          resolve(false);
        }
      } else {
        console.log('Auth Guard - Usuario no autenticado - REDIRIGIENDO a login');
        utilsSvc.routerLink('/login');
        resolve(false);
      }
    });
  });
};
