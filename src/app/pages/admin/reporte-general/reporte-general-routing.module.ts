import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteGeneralPage } from './reporte-general.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteGeneralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteGeneralPageRoutingModule {}
