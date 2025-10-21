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
    firebaseSvc.getAuth().onAuthStateChanged((auth) => {
      if (auth) {
        if (user) resolve(true);
      } else {
        utilsSvc.routerLink('/login');
        resolve(false);
      }
    });
  });
};
