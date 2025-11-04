import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AulasPageRoutingModule } from './aulas-routing.module';
import { AulasPage } from './aulas.page';
import { SharedModule } from '../../../shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AulasPageRoutingModule,
    SharedModule,
    
  ],
  declarations: [AulasPage]
})
export class AulasPageModule {}
