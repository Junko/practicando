import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { CustomTabsComponent } from './components/custom-tabs/custom-tabs.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { PadreMenuComponent } from './components/padre-menu/padre-menu.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    CustomTabsComponent,
    AdminMenuComponent,
    PadreMenuComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    CustomTabsComponent,
    AdminMenuComponent,
    PadreMenuComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
