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
    console.log('=== INICIANDO LOGIN ===');
    console.log('Formulario válido:', this.form.valid);
    console.log('Datos del formulario:', this.form.value);
    
    if (this.form.valid) {
      // Limpiar localStorage antes del login para evitar conflictos
      localStorage.removeItem('user');
      console.log('localStorage limpiado');

      const loading = await this.utilsSvc.loading();
      await loading.present();

      console.log('Llamando a Firebase signIn...');
      this.firebaseSvc.signIn(this.form.value as User).then(async res => {
        console.log('Firebase signIn exitoso:', res);
        console.log('UID del usuario:', res.user.uid);
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
    console.log('Obteniendo información del usuario con UID:', uid);
    const path = `users/${uid}`;
    console.log('Buscando en Firestore en la ruta:', path);
    
    try {
      const user = await this.firebaseSvc.getDocument(path) as any;
      console.log('Usuario obtenido de Firestore:', user);
      
      if (user) {
        console.log('Guardando usuario en localStorage...');
        this.utilsSvc.saveInLocalStorage('user', user);
        
        // Verificar que se guardó
        const savedUser = localStorage.getItem('user');
        console.log('Usuario guardado en localStorage:', savedUser);
        
        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.nombres}`,
          duration: 1500,
          color: 'success',
          position: 'top',
          icon: 'happy'
        });
        
        console.log('Redirigiendo a /main...');
        this.utilsSvc.routerLink('/main');
      } else {
        console.error('No se encontró información del usuario en Firestore');
        console.log('El usuario existe en Authentication pero no tiene perfil en Firestore');
        
        // Cerrar sesión porque no tiene perfil
        await this.firebaseSvc.signOut();
        
        this.utilsSvc.presentToast({
          message: 'Usuario no tiene perfil. Contacta al administrador.',
          duration: 3000,
          color: 'danger',
          position: 'top',
          icon: 'warning'
        });
        
        console.log('Redirigiendo a /login...');
        this.utilsSvc.routerLink('/login');
      }
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
      this.utilsSvc.presentToast({
        message: 'Error al conectar con la base de datos',
        duration: 3000,
        color: 'danger',
        position: 'top',
        icon: 'warning'
      });
    }
  }

}
