import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListasCrudPage } from './listas-crud.page';

const routes: Routes = [
  {
    path: '',
    component: ListasCrudPage
  },  {
    path: 'crear-listas',
    loadChildren: () => import('./crear-listas/crear-listas.module').then( m => m.CrearListasPageModule)
  },
  {
    path: 'ver-lista',
    loadChildren: () => import('./ver-lista/ver-lista.module').then( m => m.VerListaPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListasCrudPageRoutingModule {}
