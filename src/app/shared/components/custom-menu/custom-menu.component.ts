import { Component, Input, OnInit } from '@angular/core';
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
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';
import { MenuConfig, MenuItem } from '../../models/menu-config.model';

@Component({
  selector: 'app-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.scss'],
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
    IonLabel, 
    IonIcon
  ],
})
export class CustomMenuComponent implements OnInit {
  @Input() config: MenuConfig = {
    menuId: '',
    title: '',
    items: []
  };

  constructor() {}

  ngOnInit() {}

  onSignOut() {
    // Este método se puede sobrescribir desde el componente padre
    console.log('Sign out clicked');
  }
}
