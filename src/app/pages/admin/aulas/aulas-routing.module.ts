import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AulasPage } from './aulas.page';

const routes: Routes = [
  {
    path: '',
    component: AulasPage
  },  {
    path: 'crear',
    loadChildren: () => import('./crear/crear.module').then( m => m.CrearPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AulasPageRoutingModule {}
