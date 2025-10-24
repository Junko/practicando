import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosCrudPageRoutingModule } from './usuarios-crud-routing.module';
import { SharedModule } from '../../shared/shared-module';

import { UsuariosCrudPage } from './usuarios-crud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosCrudPageRoutingModule,
    SharedModule
  ],
  declarations: [UsuariosCrudPage]
})
export class UsuariosCrudPageModule {}
