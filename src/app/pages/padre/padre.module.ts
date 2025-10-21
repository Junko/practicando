import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared-module';

import { PadreRoutingModule } from './padre-routing.module';
import { PadreInicioPage } from './inicio/padre-inicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PadreRoutingModule,
    SharedModule
  ],
  declarations: [
    PadreInicioPage
  ]
})
export class PadreModule {}
