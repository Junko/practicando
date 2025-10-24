import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';

import { AdminLayoutComponent } from './admin-layout.component';
import { AdminInicioPage } from './inicio/admin-inicio.page';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        component: AdminInicioPage
      },
      {
        path: 'usuarios-crud',
        loadChildren: () => import('../usuarios-crud/usuarios-crud.module').then( m => m.UsuariosCrudPageModule)
      },
      {
        path: 'listas-crud',
        loadChildren: () => import('../listas-crud/listas-crud.module').then( m => m.ListasCrudPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

