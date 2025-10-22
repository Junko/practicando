import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrearUsuario } from 'src/app/models/user.model';
import { Firebase } from 'src/app/services/firebase';
import { Utils } from 'src/app/services/utils';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
  standalone: false,
})
export class CrearUsuarioPage implements OnInit {

  form = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    rol: new FormControl('', [Validators.required])
  })

  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  router = inject(Router);

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      const userData = this.form.value as CrearUsuario;
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        // Verificar si el usuario es de tipo "padre"
        if (userData.rol === 'padre') {
          // Para usuarios padre: crear solo en Authentication y navegar a agregar hijos
          await this.crearUsuarioPadre(userData);
        } else {
          // Para usuarios admin: crear completo directamente
          await this.crearUsuarioAdmin(userData);
        }
      } catch (error) {
        this.manejarError(error);
      } finally {
        loading.dismiss();
      }
    } else {
      console.log('Formulario inválido');
      this.form.markAllAsTouched();
    }
  }

  private async crearUsuarioPadre(userData: CrearUsuario) {
    try {
      const res = await this.firebaseSvc.guardarDatosTemporalesPadre(userData);
      console.log('Datos temporales de usuario padre guardados:', res);
      
      // Mostrar mensaje de éxito
      this.utilsSvc.presentToast({
        message: 'Datos guardados. Ahora agregue la información de sus hijos.',
        duration: 3000,
        color: 'success',
        position: 'top',
        icon: 'checkmark-circle'
      });

      // Limpiar formulario
      this.form.reset();
      
      // Navegar a la página de agregar hijos
      this.router.navigate(['/crear-usuario-hijo']);
      
    } catch (error) {
      throw error;
    }
  }

  private async crearUsuarioAdmin(userData: CrearUsuario) {
    try {
      const res = await this.firebaseSvc.createUserComplete(userData);
      console.log('Usuario admin creado exitosamente:', res);
      
      // Mostrar mensaje de éxito
      this.utilsSvc.presentToast({
        message: 'Usuario admin creado exitosamente',
        duration: 3000,
        color: 'success',
        position: 'top',
        icon: 'checkmark-circle'
      });

      // Limpiar formulario
      this.form.reset();
      
      // NO navegar - mantener al admin en la página de crear usuario
      // El admin puede crear múltiples usuarios sin perder su sesión
      
    } catch (error) {
      throw error;
    }
  }

  private manejarError(error: any) {
    console.error('Error al crear usuario:', error);
    
    // Mostrar mensaje de error específico
    let errorMessage = 'Error al crear usuario';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'El correo ya está en uso';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'La contraseña es muy débil';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'El correo no es válido';
    }
    
    this.utilsSvc.presentToast({
      message: errorMessage,
      duration: 3000,
      color: 'danger',
      position: 'top',
      icon: 'warning'
    });
  }

}
