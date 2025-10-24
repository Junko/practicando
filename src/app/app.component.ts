import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Firebase } from './services/firebase';
import { Utils } from './services/utils';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  
  isAuthenticated = false;
  userRole = '';
  currentRoute = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.checkAuthenticationStatus();
      });

    // Verificar estado inicial
    this.checkAuthenticationStatus();
  }

  checkAuthenticationStatus() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.isAuthenticated = true;
        this.userRole = userData.rol || '';
      } catch (error) {
        this.isAuthenticated = false;
        this.userRole = '';
        localStorage.removeItem('user');
      }
    } else {
      this.isAuthenticated = false;
      this.userRole = '';
    }
  }

  shouldShowMenu(): boolean {
    // Solo mostrar menú si está autenticado y no está en login
    return this.isAuthenticated && !this.currentRoute.includes('/login');
  }

  shouldShowAdminMenu(): boolean {
    return this.shouldShowMenu() && this.userRole === 'admin';
  }

  shouldShowPadreMenu(): boolean {
    return this.shouldShowMenu() && this.userRole === 'padre';
  }

  signOut() {
    this.firebaseSvc.signOut();
    this.isAuthenticated = false;
    this.userRole = '';
    this.utilsSvc.routerLink('/login');
  }
}
