import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearListasPageRoutingModule } from './crear-listas-routing.module';

import { CrearListasPage } from './crear-listas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CrearListasPageRoutingModule
  ],
  declarations: [CrearListasPage]
})
export class CrearListasPageModule {}
