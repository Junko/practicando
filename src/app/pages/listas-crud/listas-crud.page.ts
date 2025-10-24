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
  
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadListas();
  }

  loadListas() {
    // Aquí se cargarán las listas desde Firebase
    // Por ahora, datos de ejemplo
    this.listas = [
      {
        id: '1',
        name: 'Lista de Útiles Primaria',
        nivel: 'Primaria',
        grado: '1er Grado',
        anio: '2024',
        materiales: []
      },
      {
        id: '2', 
        name: 'Lista de Útiles Secundaria',
        nivel: 'Secundaria',
        grado: '1er Año',
        anio: '2024',
        materiales: []
      }
    ];
  }

  navigateToCreate() {
    this.router.navigate(['/listas-crud/crear-listas']);
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
