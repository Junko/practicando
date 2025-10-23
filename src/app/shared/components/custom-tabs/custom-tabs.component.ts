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
    // Registrar todos los iconos necesarios para las tabs
    addIcons({
      'home-outline': 'home-outline',
      'library-outline': 'library-outline',
      'notifications-outline': 'notifications-outline',
      'person-circle-outline': 'person-circle-outline',
      'home': 'home',
      'list': 'list',
      'people': 'people',
      'person': 'person',
      'bar-chart': 'bar-chart'
    });
  }

  get tabBarPosition(): string {
    return this.config.tabBarPosition || 'bottom';
  }

  get tabBarColor(): string {
    return this.config.tabBarColor || 'primary';
  }
}
