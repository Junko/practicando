import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearUsuarioPageRoutingModule } from './crear-usuario-routing.module';

import { CrearUsuarioPage } from './crear-usuario.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CrearUsuarioPageRoutingModule,
    SharedModule
  ],
  declarations: [CrearUsuarioPage]
})
export class CrearUsuarioPageModule {}
