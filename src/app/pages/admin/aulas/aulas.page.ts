import { Component, OnInit } from '@angular/core';
import { ADMIN_TABS_CONFIG } from '../../../shared/configs/tabs-configs';
import { TabsConfig } from '../../../shared/models/tab-config.model';

import { Firebase } from '../../../services/firebase';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.page.html',
  styleUrls: ['./aulas.page.scss'],
  standalone: false,
})
export class AulasPage implements OnInit {
  aulas: any[] = [];
  aulasFiltradas: any[] = [];
  filtroTipo: string = 'Todos';
  busqueda: string = '';
  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;

  constructor(private firebaseSvc: Firebase,
    private router: Router,
    private alertCtrl: AlertController) {}

  async ngOnInit() {
    await this.cargarAulas();
  }

  async cargarAulas() {
    const data = await this.firebaseSvc.getCollection('aulas');
    this.aulas = data;
    this.aulasFiltradas = [...data];
  }

  filtrar() {
    this.aulasFiltradas = this.aulas.filter(aula => {
      const coincideTipo = this.filtroTipo === 'Todos' || aula.tipoAula === this.filtroTipo;
      const coincideBusqueda =
        aula.nombreAula.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        aula.nivel.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        aula.grado?.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideTipo && coincideBusqueda;
    });
  }


  irCrear() {
    this.router.navigate(['/admin/aulas/crear']);
  }
  
editarAula(aula: any) {
  this.router.navigate(['/admin/aulas/crear'], {
    queryParams: { id: aula.id }
  });
}

  async eliminarAula(aula: any) {
    const alerta = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Seguro que deseas eliminar el aula "${aula.nombreAula}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.firebaseSvc.deleteDocument(`aulas/${aula.id}`);
            await this.cargarAulas();
          },
        },
      ],
    });
    await alerta.present();
  }
}