import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListasCrudPageRoutingModule } from './listas-crud-routing.module';
import { SharedModule } from '../../shared/shared-module';

import { ListasCrudPage } from './listas-crud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListasCrudPageRoutingModule,
    SharedModule
  ],
  declarations: [ListasCrudPage]
})
export class ListasCrudPageModule {}
