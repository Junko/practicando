import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListasCrudPageRoutingModule } from './listas-crud-routing.module';

import { ListasCrudPage } from './listas-crud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListasCrudPageRoutingModule
  ],
  declarations: [ListasCrudPage]
})
export class ListasCrudPageModule {}
