import { Component, OnInit, inject } from '@angular/core';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';
import { PADRE_TABS_CONFIG } from '../../../shared/configs/tabs-configs';
import { TabsConfig } from '../../../shared/models/tab-config.model';

@Component({
  selector: 'app-padre-inicio',
  templateUrl: './padre-inicio.page.html',
  styleUrls: ['./padre-inicio.page.scss'],
  standalone: false
})
export class PadreInicioPage implements OnInit {

  userInfo: any = null;
  hijos: any[] = [];
  loading = true;

  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  tabsConfig: TabsConfig = PADRE_TABS_CONFIG;

  constructor() { }

  async ngOnInit() {
    await this.loadUserInfo();
    await this.loadHijos();
  }

  loadUserInfo() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      console.log('Padre cargado:', this.userInfo);
      console.log('UID del padre:', this.userInfo?.uid);
    } else {
      console.error('No se encontró información del padre');
    }
  }

  async loadHijos() {
    try {
      if (!this.userInfo || !this.userInfo.uid) {
        console.error('No hay información del padre o UID no encontrado');
        this.loading = false;
        return;
      }

      console.log('Buscando estudiantes para padre UID:', this.userInfo.uid);
      
      this.hijos = await this.firebaseSvc.getEstudiantesByPadreUid(this.userInfo.uid);
      
      console.log('Hijos cargados:', this.hijos);
      console.log('Cantidad de hijos:', this.hijos.length);
      
      this.loading = false;
    } catch (error) {
      console.error('Error al cargar hijos:', error);
      this.loading = false;
    }
  }

  signOut() {
    this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/login');
  }

}

