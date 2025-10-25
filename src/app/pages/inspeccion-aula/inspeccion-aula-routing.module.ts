import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InspeccionAulaPage } from './inspeccion-aula.page';

const routes: Routes = [
  {
    path: '',
    component: InspeccionAulaPage,
  },
  {
        path: 'registro',
        loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule)
     
  }
 

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspeccionAulaPageRoutingModule {}
