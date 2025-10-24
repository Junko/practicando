import { Component, OnInit, inject } from '@angular/core';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';
import { ADMIN_TABS_CONFIG } from '../../../shared/configs/tabs-configs';
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
  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;

  constructor() { }

  ngOnInit() {
    this.loadUserInfo();
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

}
