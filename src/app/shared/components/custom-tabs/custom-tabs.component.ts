import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonIcon,
  IonTabBar,
  IonTabButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { TabConfig, TabsConfig } from '../../models/tab-config.model';

@Component({
  selector: 'app-custom-tabs',
  templateUrl: './custom-tabs.component.html',
  styleUrls: ['./custom-tabs.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonIcon, IonTabBar, IonTabButton],
})
export class CustomTabsComponent implements OnInit {
  @Input() config: TabsConfig = {
    tabs: [],
    tabBarPosition: 'bottom',
    tabBarColor: 'primary'
  };

  constructor() {
    // Registrar iconos dinámicamente
    this.registerIcons();
  }

  ngOnInit() {
    // Registrar iconos cuando se inicializa el componente
    this.registerIcons();
  }

  private registerIcons() {
    // Los iconos ya están registrados globalmente en main.ts
    // No es necesario registrarlos aquí
  }

  get tabBarPosition(): string {
    return this.config.tabBarPosition || 'bottom';
  }

  get tabBarColor(): string {
    return this.config.tabBarColor || 'primary';
  }
}
