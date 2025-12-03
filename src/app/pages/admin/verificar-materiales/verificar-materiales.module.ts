import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificarMaterialesPageRoutingModule } from './verificar-materiales-routing.module';
import { SharedModule } from '../../../shared/shared-module';

import { VerificarMaterialesPage } from './verificar-materiales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificarMaterialesPageRoutingModule,
    SharedModule
  ],
  declarations: [VerificarMaterialesPage]
})
export class VerificarMaterialesPageModule {}

