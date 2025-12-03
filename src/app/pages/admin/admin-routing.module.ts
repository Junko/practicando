import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

import { AdminInicioPage } from './inicio/admin-inicio.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: AdminInicioPage,
    canActivate: [adminGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'aulas',
    loadChildren: () => import('./aulas/aulas.module').then( m => m.AulasPageModule)
  },
  {
    path: 'verificar-materiales',
    loadChildren: () => import('./verificar-materiales/verificar-materiales.module').then( m => m.VerificarMaterialesPageModule)
  },
  {
    path: 'reporte-general',
    loadChildren: () => import('./reporte-general/reporte-general.module').then( m => m.ReporteGeneralPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

