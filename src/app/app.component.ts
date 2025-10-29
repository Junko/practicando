import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
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

  constructor(
    private router: Router,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.checkAuthenticationStatus();
        // Cerrar menús cuando se navega a una nueva ruta
        this.closeAllMenus();
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

  async closeAllMenus() {
    try {
      // Cerrar menú de admin
      await this.menuController.close('admin-menu');
      // Cerrar menú de padre
      await this.menuController.close('padre-menu');
    } catch (error) {
      // Ignorar errores si el menú no está abierto
      console.warn('Error al cerrar menús:', error);
    }
  }

  async navigateAndCloseMenu(route: string) {
    // Cerrar todos los menús primero
    await this.closeAllMenus();
    // Navegar a la ruta
    this.router.navigate([route]);
  }

  async signOut() {
    // Cerrar menús antes de cerrar sesión
    await this.closeAllMenus();
    this.firebaseSvc.signOut();
    this.isAuthenticated = false;
    this.userRole = '';
    this.utilsSvc.routerLink('/login');
  }
}
