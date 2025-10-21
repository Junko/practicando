import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Firebase } from 'src/app/services/firebase';
import { Utils } from 'src/app/services/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required])
  })

  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils)

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      // Limpiar localStorage antes del login
      localStorage.removeItem('user');

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as User).then(async res => {
        // Obtener perfil del usuario y guardar/navegar
        await this.getUserInfo(res.user.uid);
      
      }).catch(error => {
          console.error('Error en login:', error);
          
          // Mostrar mensaje de error amigable al usuario
          this.utilsSvc.presentToast({
            message: 'Credenciales incorrectas',
            duration: 3000,
            color: 'danger',
            position: 'top',
            icon: 'warning'
          });
      
      }).finally(() => {
        loading.dismiss();
      })
    } else {
      console.log('Formulario inválido');
      this.form.markAllAsTouched();
    }
  }

  // Obtener información del usuario después del login
  async getUserInfo(uid: string) {
    const path = `users/${uid}`;
    const user = await this.firebaseSvc.getDocument(path) as any;
    
    if (user) {
      this.utilsSvc.saveInLocalStorage('user', user);
      this.utilsSvc.presentToast({
        message: `Te damos la bienvenida ${user.nombres}`,
        duration: 1500,
        color: 'success',
        position: 'top',
        icon: 'happy'
      });
      this.utilsSvc.routerLink('/main');
    }
  }

}
