import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared-module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminInicioPage } from './inicio/admin-inicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    AdminInicioPage
  ]
})
export class AdminModule {}
