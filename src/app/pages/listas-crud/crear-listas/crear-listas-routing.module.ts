import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearListasPage } from './crear-listas.page';

const routes: Routes = [
  {
    path: '',
    component: CrearListasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearListasPageRoutingModule {}
