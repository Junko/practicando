import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartPageRoutingModule } from './start-routing.module';

import { StartPage } from './start.page';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartPageRoutingModule,
    SharedModule
  ],
  declarations: [StartPage]
})
export class StartPageModule {}
