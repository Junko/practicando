import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VerUsuarioPageRoutingModule } from './ver-usuario-routing.module';
import { VerUsuarioPage } from './ver-usuario.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerUsuarioPageRoutingModule,
    SharedModule
  ],
  declarations: [VerUsuarioPage]
})
export class VerUsuarioPageModule {}
