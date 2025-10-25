import { Component, OnDestroy, OnInit } from '@angular/core';
import { Firebase } from '../../services/firebase';
import { ADMIN_TABS_CONFIG } from '../../shared/configs/tabs-configs';
import { TabsConfig } from '../../shared/models/tab-config.model';

interface Seccion {
  nombre: string;
}

interface Grado {
  nombre: string;
  secciones: Seccion[];
  expandido: boolean;
}

interface Nivel {
  nombre: string;
  grados: Grado[];
  expandido: boolean;
}

@Component({
  selector: 'app-inspeccion-aula',
  templateUrl: './inspeccion-aula.page.html',
  styleUrls: ['./inspeccion-aula.page.scss'],
  standalone: false,
})
export class InspeccionAulaPage implements OnInit, OnDestroy {

  niveles: Nivel[] = [];
  datos: any[] = [];
  unsubscrube: any;
   tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;

  constructor(private firebaseSvc: Firebase) {}

  async ngOnInit() {
    
    this.datos = await this.firebaseSvc.getCollectionOnce('niveles');
    console.log('Datos de Firebase:', this.datos);


    this.niveles = this.datos.map((item: any) => ({
      nombre: item.nombre,
      grados: item.grados || [],
      expandido: false,
    }));
  }

  toggleNivel(nombre: string) {
    this.niveles = this.niveles.map((nivel) => ({
      ...nivel,
      expandido: nivel.nombre === nombre ? !nivel.expandido : false,
      grados: nivel.grados.map((grado) => ({ ...grado, expandido: false })),
    }));
  }

  toggleGrado(nivelNombre: string, gradoNombre: string) {
    this.niveles = this.niveles.map((nivel) =>
      nivel.nombre === nivelNombre
        ? {
            ...nivel,
            grados: nivel.grados.map((grado) =>
              grado.nombre === gradoNombre
                ? { ...grado, expandido: !grado.expandido }
                : { ...grado, expandido: false }
            ),
          }
        : nivel
    );
  }

  ngOnDestroy() {
    if (this.unsubscrube) this.unsubscrube();
  }
}