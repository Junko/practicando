import { Component, OnInit, inject } from '@angular/core';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';
import { PADRE_TABS_CONFIG } from '../../../shared/configs/tabs-configs';
import { TabsConfig } from '../../../shared/models/tab-config.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  userInfo: any = null;
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  tabsConfig: TabsConfig = PADRE_TABS_CONFIG;
  hijos: any[] = [];

  constructor() { }

  ngOnInit() {
    this.loadUserInfo();
    this.loadHijos();
  }

  loadUserInfo() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      console.log('Usuario cargado:', this.userInfo);
    } else {
      console.error('No se encontró información del usuario');
    }
  }

  async loadHijos() {
    try {
      const uid = this.userInfo?.uid || this.userInfo?.user?.uid || this.userInfo?.id;
      if (!uid) return;
      this.hijos = await this.firebaseSvc.getEstudiantesByPadreUid(uid);
    } catch (e) {
      console.error('Error cargando hijos', e);
    }
  }

  async logout() {
    try {
      await this.firebaseSvc.signOut();
    } finally {
      this.utilsSvc.routerLink('/login');
    }
  }

}
