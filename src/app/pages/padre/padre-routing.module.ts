import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { padreGuard } from '../../guards/padre.guard';

import { PadreInicioPage } from './inicio/padre-inicio.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: PadreInicioPage,
    canActivate: [padreGuard]
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PadreRoutingModule {}

