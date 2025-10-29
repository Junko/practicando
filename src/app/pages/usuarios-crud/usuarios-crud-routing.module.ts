import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosCrudPage } from './usuarios-crud.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosCrudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosCrudPageRoutingModule {}
