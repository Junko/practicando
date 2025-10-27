import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firebase } from 'src/app/services/firebase';
import { Utils } from 'src/app/services/utils';
import { PADRE_TABS_CONFIG } from 'src/app/shared/configs/tabs-configs';
import { TabsConfig } from 'src/app/shared/models/tab-config.model';

@Component({
  selector: 'app-ver-materiales',
  templateUrl: './ver-materiales.page.html',
  styleUrls: ['./ver-materiales.page.scss'],
  standalone: false,
})
export class VerMaterialesPage implements OnInit {

  estudianteId: string | null = null;
  estudiante: any = null;
  lista: any = null;
  loading = true;

  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  tabsConfig: TabsConfig = PADRE_TABS_CONFIG;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.estudianteId = this.route.snapshot.paramMap.get('id');
    if (this.estudianteId) {
      this.loadData();
    } else {
      console.error('ID de estudiante no encontrado');
      this.utilsSvc.presentToast({
        message: 'Error: ID de estudiante no encontrado',
        duration: 2000,
        color: 'danger'
      });
      this.router.navigate(['/padre/inicio']);
    }
  }

  async loadData() {
    try {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Cargar información del estudiante
      this.estudiante = await this.firebaseSvc.getDocument(`estudiantes/${this.estudianteId}`);
      
      if (!this.estudiante) {
        await loading.dismiss();
        await this.utilsSvc.presentToast({
          message: 'Estudiante no encontrado',
          duration: 2000,
          color: 'danger'
        });
        this.router.navigate(['/padre/inicio']);
        return;
      }

      // Cargar lista de útiles según el grado y nivel del estudiante
      if (this.estudiante.grado && this.estudiante.nivel) {
        this.lista = await this.firebaseSvc.getListaByGradoYNivel(
          this.estudiante.grado,
          this.estudiante.nivel
        );
      }

      await loading.dismiss();
      this.loading = false;

      if (!this.lista) {
        console.log('No se encontró lista para este grado y nivel');
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.loading = false;
      await this.utilsSvc.presentToast({
        message: 'Error al cargar los datos',
        duration: 2000,
        color: 'danger'
      });
      this.router.navigate(['/padre/inicio']);
    }
  }

  goBack() {
    this.router.navigate(['/padre/inicio']);
  }

  onMaterialToggle(material: any) {
    console.log('Material toggled:', material.nombre_material, 'Entregado:', material.entregado);
    // Aquí puedes agregar lógica para guardar el estado en Firebase
  }

}
