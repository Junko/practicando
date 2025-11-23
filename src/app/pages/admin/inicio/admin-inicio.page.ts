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

  async ngOnInit() {
    this.loadUserInfo();
    await this.loadCounters();
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

async loadCounters() {
  try {
    // total de padres
    this.totalPadres = await this.firebaseSvc.getCountByField(
      'users',
      'rol',
      'padre'
    );

    // total de listas
    this.totalListas = await this.firebaseSvc.getCollectionCount('listas_utiles');

    // total de salones
    this.totalSalones = await this.firebaseSvc.getCollectionCount('aulas');

    console.log('Contadores cargados');
    
  } catch (error) {
    console.error('Error cargando contadores', error);
  }
}

  signOut() {
    this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/login');
  }

}

