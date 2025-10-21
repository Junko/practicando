import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosCrudPageRoutingModule } from './usuarios-crud-routing.module';

import { UsuariosCrudPage } from './usuarios-crud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosCrudPageRoutingModule
  ],
  declarations: [UsuariosCrudPage]
})
export class UsuariosCrudPageModule {}
