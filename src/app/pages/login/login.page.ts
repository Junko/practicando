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
    console.log('Login - Iniciando proceso de login');
    console.log('Login - Formulario válido:', this.form.valid);
    console.log('Login - Datos del formulario:', this.form.value);
    
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      console.log('Login - Llamando a Firebase signIn');
      this.firebaseSvc.signIn(this.form.value as User).then(async res => {
        console.log('Login - Firebase signIn exitoso:', res);
        // Obtener perfil del usuario y guardar/navegar
        await this.getUserInfo(res.user.uid);
      
      }).catch(error => {
          console.error('Login - Error en Firebase signIn:', error);
          
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
      console.log('Login - Formulario inválido');
      this.form.markAllAsTouched();
    }
  }

  // Obtener información del usuario después del login
  async getUserInfo(uid: string) {
    console.log('Login - Obteniendo información del usuario con UID:', uid);
    const path = `users/${uid}`;
    const user = await this.firebaseSvc.getDocument(path) as any;
    console.log('Login - Usuario obtenido de Firestore:', user);
    
    if (user) {
      console.log('Login - Guardando usuario en localStorage');
      this.utilsSvc.saveInLocalStorage('user', user);
      this.utilsSvc.presentToast({
        message: `Te damos la bienvenida ${user.nombres}`,
        duration: 1500,
        color: 'success',
        position: 'top',
        icon: 'happy'
      });
      console.log('Login - Redirigiendo a /main');
      this.utilsSvc.routerLink('/main');
    } else {
      console.error('Login - No se encontró información del usuario en Firestore');
      this.utilsSvc.presentToast({
        message: 'Error: No se encontró información del usuario',
        duration: 3000,
        color: 'danger',
        position: 'top',
        icon: 'warning'
      });
    }
  }

}
