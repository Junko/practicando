import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerListaPage } from './ver-lista.page';

const routes: Routes = [
  {
    path: '',
    component: VerListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerListaPageRoutingModule {}
