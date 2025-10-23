import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { TabConfig, TabsConfig } from '../../models/tab-config.model';

@Component({
  selector: 'app-custom-tabs',
  templateUrl: './custom-tabs.component.html',
  styleUrls: ['./custom-tabs.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonHeader, IonIcon, IonTab, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar],
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
    // Obtener todos los iconos únicos de la configuración
    const icons = this.config.tabs.map(tab => tab.icon).filter((icon, index, self) => self.indexOf(icon) === index);
    
    // Crear objeto de iconos para addIcons
    const iconsObj: any = {};
    icons.forEach(icon => {
      iconsObj[icon] = icon;
    });

    // Registrar iconos si hay alguno
    if (Object.keys(iconsObj).length > 0) {
      addIcons(iconsObj);
    }
  }

  get tabBarPosition(): string {
    return this.config.tabBarPosition || 'bottom';
  }

  get tabBarColor(): string {
    return this.config.tabBarColor || 'primary';
  }
}
