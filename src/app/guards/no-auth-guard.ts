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
    firebaseSvc.auth.authState.subscribe((auth) => {
      if (!auth) {
        resolve(true); // Permitir acceso si no está autenticado
      } else {
        utilsSvc.routerLink('/main'); // Redirigir a main si ya está autenticado
        resolve(false);
      }
    });
  });
};
