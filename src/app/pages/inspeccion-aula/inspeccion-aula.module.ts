import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspeccionAulaPageRoutingModule } from './inspeccion-aula-routing.module';

import { InspeccionAulaPage } from './inspeccion-aula.page';
import { SharedModule } from 'src/app/shared/shared-module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InspeccionAulaPageRoutingModule,
    SharedModule
  ],
  declarations: [InspeccionAulaPage]
})
export class InspeccionAulaPageModule {}
