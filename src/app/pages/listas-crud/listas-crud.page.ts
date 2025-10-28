import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firebase } from '../../services/firebase';
import { Utils } from '../../services/utils';
import { ADMIN_TABS_CONFIG } from '../../shared/configs/tabs-configs';
import { TabsConfig } from '../../shared/models/tab-config.model';

@Component({
  selector: 'app-listas-crud',
  templateUrl: './listas-crud.page.html',
  styleUrls: ['./listas-crud.page.scss'],
  standalone: false,
})
export class ListasCrudPage implements OnInit {

  listas: any[] = []; // Aquí se cargarán las listas desde Firebase
  loading = false;
  
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadListas();
  }

  async loadListas() {
    try {
      this.loading = true;
      
      this.listas = await this.firebaseSvc.getAllListasUtiles();
      
      this.loading = false;
      
      console.log('Listas cargadas:', this.listas);
    } catch (error) {
      console.error('Error al cargar listas:', error);
      this.loading = false;
      await this.utilsSvc.presentToast({
        message: 'Error al cargar las listas',
        duration: 2000,
        color: 'danger'
      });
    }
  }

  navigateToCreate() {
    this.router.navigate(['/listas-crud/crear-listas']);
  }

  async verDetalleLista(lista: any) {
    try {
      await this.router.navigate(['/listas-crud/ver-lista', lista.id]);
    } catch (error) {
      console.error('Error en navegación:', error);
      await this.utilsSvc.presentToast({
        message: 'Error al abrir la lista',
        duration: 2000,
        color: 'danger'
      });
    }
  }

  editLista(lista: any) {
    console.log('Editar lista:', lista);
    // Aquí irá la lógica para editar
  }

  deleteLista(lista: any) {
    console.log('Eliminar lista:', lista);
    // Aquí irá la lógica para eliminar
  }

  signOut() {
    this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/login');
  }

}
