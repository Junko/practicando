import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarListaPageRoutingModule } from './editar-lista-routing.module';

import { EditarListaPage } from './editar-lista.page';
import { SharedModule } from '../shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarListaPageRoutingModule,
    SharedModule
  ],
  declarations: [EditarListaPage]
})
export class EditarListaPageModule {}
