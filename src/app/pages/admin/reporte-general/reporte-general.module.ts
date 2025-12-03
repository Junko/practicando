import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReporteGeneralPageRoutingModule } from './reporte-general-routing.module';
import { ReporteGeneralPage } from './reporte-general.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteGeneralPageRoutingModule,
    SharedModule
  ],
  declarations: [ReporteGeneralPage]
})
export class ReporteGeneralPageModule {}

