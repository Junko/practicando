import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearUsuarioHijoPage } from './crear-usuario-hijo.page';

const routes: Routes = [
  {
    path: '',
    component: CrearUsuarioHijoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearUsuarioHijoPageRoutingModule {}
