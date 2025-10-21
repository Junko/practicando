import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { padreGuard } from '../../guards/padre.guard';

import { PadreInicioPage } from './inicio/padre-inicio.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: PadreInicioPage,
    canActivate: [padreGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PadreRoutingModule {}
