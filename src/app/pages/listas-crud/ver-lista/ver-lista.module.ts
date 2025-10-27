import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerListaPageRoutingModule } from './ver-lista-routing.module';

import { VerListaPage } from './ver-lista.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerListaPageRoutingModule,
    SharedModule
  ],
  declarations: [VerListaPage]
})
export class VerListaPageModule {}
