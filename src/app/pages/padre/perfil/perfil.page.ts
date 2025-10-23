import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Firebase } from 'src/app/services/firebase';
import { Utils } from 'src/app/services/utils';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {

  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);

  constructor() { }

  ngOnInit() {
  }

  async signOut() {
    await this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/auth');
  }

  async changePassword() {
    const user = this.firebaseSvc.getAuth().currentUser;
    if (user && user.email) {
      await this.firebaseSvc.sendRecoveryEmail(user.email);
      this.utilsSvc.presentToast({
        message: 'Se ha enviado un correo electrónico para restablecer tu contraseña.',
        duration: 3000,
        color: 'success',
        position: 'bottom'
      });
    } else {
      this.utilsSvc.presentToast({
        message: 'No se pudo obtener el correo electrónico del usuario.',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
    }
  }

}