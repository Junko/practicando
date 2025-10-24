import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  IonApp, 
  IonContent, 
  IonHeader, 
  IonMenu, 
  IonMenuButton, 
  IonRouterOutlet, 
  IonTitle, 
  IonToolbar,
  IonList,
  IonItem,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { Firebase } from '../../services/firebase';
import { Utils } from '../../services/utils';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CustomTabsComponent } from '../../shared/components/custom-tabs/custom-tabs.component';
import { ADMIN_TABS_CONFIG } from '../../shared/configs/tabs-configs';
import { TabsConfig } from '../../shared/models/tab-config.model';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonApp,
    IonContent,
    IonHeader,
    IonMenu,
    IonMenuButton,
    IonRouterOutlet,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    HeaderComponent,
    CustomTabsComponent
  ]
})
export class AdminLayoutComponent {
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;

  signOut() {
    this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/login');
  }
}
