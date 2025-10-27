import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerMaterialesPage } from './ver-materiales.page';

const routes: Routes = [
  {
    path: ':id',
    component: VerMaterialesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerMaterialesPageRoutingModule {}
