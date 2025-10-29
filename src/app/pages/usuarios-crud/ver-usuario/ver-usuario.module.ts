import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VerUsuarioPageRoutingModule } from './ver-usuario-routing.module';
import { VerUsuarioPage } from './ver-usuario.page';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerUsuarioPageRoutingModule
  ],
  declarations: [VerUsuarioPage, HeaderComponent]
})
export class VerUsuarioPageModule {}
