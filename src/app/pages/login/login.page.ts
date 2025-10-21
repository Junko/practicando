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
    // Limpiar el formulario al inicializar la página
    this.clearForm();
  }

  // Función para limpiar el formulario
  clearForm() {
    this.form.reset();
    this.form.markAsUntouched();
    this.form.markAsPristine();
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
          
          // Limpiar el formulario en caso de error
          this.clearForm();
          
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
        localStorage.setItem('user', JSON.stringify(user));
        
        // Verificar que se guardó inmediatamente
        const savedUser = localStorage.getItem('user');
        console.log('Usuario guardado en localStorage:', savedUser);
        
        if (savedUser) {
        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.nombres}`,
          duration: 1500,
          color: 'success',
          position: 'top',
          icon: 'happy'
        });
        
        // Limpiar el formulario después del login exitoso
        this.clearForm();
          
          console.log('Redirigiendo a /main...');
          // Remover el foco del botón activo para evitar problemas de accesibilidad
          if (document.activeElement && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          
          // Navegar según el rol del usuario
          if (user.rol === 'admin') {
            this.utilsSvc.routerLink('/admin/inicio');
          } else if (user.rol === 'padre') {
            this.utilsSvc.routerLink('/padre/inicio');
          } else {
            // Rol no reconocido, ir a main como fallback
            this.utilsSvc.routerLink('/main/home');
          }
        } else {
          console.error('Error: Usuario no se guardó en localStorage');
          this.utilsSvc.presentToast({
            message: 'Error al guardar sesión',
            duration: 3000,
            color: 'danger',
            position: 'top',
            icon: 'warning'
          });
        }
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
        // Remover el foco del botón activo para evitar problemas de accesibilidad
        if (document.activeElement && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        setTimeout(() => {
          this.utilsSvc.routerLink('/login');
        }, 100);
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
