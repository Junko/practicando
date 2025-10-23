import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomTabsComponent } from '../../shared/components/custom-tabs/custom-tabs.component';
import { ADMIN_TABS_CONFIG, PADRE_TABS_CONFIG } from '../../shared/configs/tabs-configs';
import { TabsConfig } from '../../shared/models/tab-config.model';

@Component({
  selector: 'app-example-tabs',
  templateUrl: './example-tabs.page.html',
  styleUrls: ['./example-tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CustomTabsComponent]
})
export class ExampleTabsPage implements OnInit {
  
  // Configuración actual de tabs
  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;
  
  // Tipo de usuario actual
  userType: 'admin' | 'padre' = 'admin';

  constructor() { }

  ngOnInit() {
    // Por defecto mostrar tabs de admin
    this.loadTabsConfig('admin');
  }

  /**
   * Carga la configuración de tabs según el tipo de usuario
   */
  loadTabsConfig(userType: 'admin' | 'padre') {
    this.userType = userType;
    
    switch (userType) {
      case 'admin':
        this.tabsConfig = ADMIN_TABS_CONFIG;
        break;
      case 'padre':
        this.tabsConfig = PADRE_TABS_CONFIG;
        break;
      default:
        this.tabsConfig = ADMIN_TABS_CONFIG;
    }
  }

  /**
   * Cambia entre tipos de usuario (para demostración)
   */
  switchUserType() {
    const newType = this.userType === 'admin' ? 'padre' : 'admin';
    this.loadTabsConfig(newType);
  }
}
