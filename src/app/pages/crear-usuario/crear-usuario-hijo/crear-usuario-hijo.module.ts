import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearUsuarioHijoPageRoutingModule } from './crear-usuario-hijo-routing.module';

import { CrearUsuarioHijoPage } from './crear-usuario-hijo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearUsuarioHijoPageRoutingModule
  ],
  declarations: [CrearUsuarioHijoPage]
})
export class CrearUsuarioHijoPageModule {}
