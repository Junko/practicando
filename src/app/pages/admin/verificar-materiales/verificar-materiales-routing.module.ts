import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificarMaterialesPage } from './verificar-materiales.page';

const routes: Routes = [
  {
    path: '',
    component: VerificarMaterialesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificarMaterialesPageRoutingModule {}

