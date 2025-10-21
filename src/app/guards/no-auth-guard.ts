import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Firebase } from '../services/firebase';
import { Utils } from '../services/utils';

export const noAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  
  const firebaseSvc = inject(Firebase);
  const utilsSvc = inject(Utils);

  return new Promise((resolve) => {
    const subscription = firebaseSvc.auth.authState.subscribe((auth) => {
      subscription.unsubscribe(); // Desuscribirse inmediatamente
      
      console.log('No-Auth Guard - Auth:', auth);
      
      if (!auth) {
        console.log('No-Auth Guard - PERMITIDO (no autenticado)');
        resolve(true); // Permitir acceso si no está autenticado
      } else {
        console.log('No-Auth Guard - BLOQUEADO - Redirigiendo a home');
        utilsSvc.routerLink('/home'); // Redirigir a home si ya está autenticado
        resolve(false);
      }
    });
  });
};
