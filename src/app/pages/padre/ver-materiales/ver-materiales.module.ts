import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerMaterialesPageRoutingModule } from './ver-materiales-routing.module';

import { VerMaterialesPage } from './ver-materiales.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerMaterialesPageRoutingModule,
    SharedModule
  ],
  declarations: [VerMaterialesPage]
})
export class VerMaterialesPageModule {}
