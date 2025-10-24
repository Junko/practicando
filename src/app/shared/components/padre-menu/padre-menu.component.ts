import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonApp,
  IonRouterOutlet
} from '@ionic/angular/standalone';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';

@Component({
  selector: 'app-padre-menu',
  templateUrl: './padre-menu.component.html',
  styleUrls: ['./padre-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonApp,
    IonRouterOutlet
  ]
})
export class PadreMenuComponent {
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);

  signOut() {
    this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/login');
  }
}
