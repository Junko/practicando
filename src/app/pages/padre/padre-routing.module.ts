import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { padreGuard } from '../../guards/padre.guard';

import { PadreInicioPage } from './inicio/padre-inicio.page';
import { VerMaterialesPage } from './ver-materiales/ver-materiales.page';
import { NotificacionesPage } from './notificaciones/notificaciones.page';
import { PerfilPage } from './perfil/perfil.page';

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
    path: 'ver-materiales/:id',
    component: VerMaterialesPage
  },
  {
    path: 'notificaciones',
    component: NotificacionesPage
  },
  {
    path: 'perfil',
    component: PerfilPage
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PadreRoutingModule {}
