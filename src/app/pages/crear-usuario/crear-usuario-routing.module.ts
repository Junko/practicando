import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearUsuarioPage } from './crear-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: CrearUsuarioPage
  },  {
    path: 'crear-usuario-hijo',
    loadChildren: () => import('./crear-usuario-hijo/crear-usuario-hijo.module').then( m => m.CrearUsuarioHijoPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearUsuarioPageRoutingModule {}
