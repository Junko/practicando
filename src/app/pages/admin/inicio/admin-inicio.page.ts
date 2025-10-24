import { Component, OnInit, inject } from '@angular/core';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';
import { ADMIN_TABS_CONFIG } from '../../../shared/configs/tabs-configs';
import { TabsConfig } from '../../../shared/models/tab-config.model';

@Component({
  selector: 'app-admin-inicio',
  templateUrl: './admin-inicio.page.html',
  styleUrls: ['./admin-inicio.page.scss'],
  standalone: false
})
export class AdminInicioPage implements OnInit {

  userInfo: any = null;
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;

  // Contadores para los cuadros informativos
  totalPadres: number = 0;
  totalListas: number = 0;
  totalSalones: number = 0;

  constructor() { }

  ngOnInit() {
    this.loadUserInfo();
    this.loadCounters();
  }

  loadUserInfo() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      console.log('Admin cargado:', this.userInfo);
    } else {
      console.error('No se encontró información del admin');
    }
  }

  loadCounters() {
    // Por ahora usamos valores estáticos, más adelante se pueden conectar con Firebase
    this.totalPadres = 45;
    this.totalListas = 12;
    this.totalSalones = 8;
  }

  signOut() {
    this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/login');
  }

}

