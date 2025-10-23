import { Component, OnInit, inject } from '@angular/core';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';

@Component({
  selector: 'app-admin-inicio',
  templateUrl: './admin-inicio.page.html',
  styleUrls: ['./admin-inicio.page.scss'],
  standalone: false
})
export class AdminInicioPage implements OnInit {

  userInfo: any = null;
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);

  constructor() { }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      console.log('Admin cargado:', this.userInfo);
    } else {
      console.error('No se encontró información del admin');
    }
  }

  signOut() {
    this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/login');
  }

}

