import { Component, OnInit, inject } from '@angular/core';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';

@Component({
  selector: 'app-padre-inicio',
  templateUrl: './padre-inicio.page.html',
  styleUrls: ['./padre-inicio.page.scss'],
  standalone: false
})
export class PadreInicioPage implements OnInit {

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
      console.log('Padre cargado:', this.userInfo);
    } else {
      console.error('No se encontró información del padre');
    }
  }

  signOut() {
    this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/login');
  }

}
