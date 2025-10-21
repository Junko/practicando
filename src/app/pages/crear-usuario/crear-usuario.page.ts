import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  utilsSvc = inject(Utils)

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.createUserComplete(this.form.value as CrearUsuario).then(async res => {
        console.log('Usuario creado exitosamente:', res);
        console.log('Usuario actual en localStorage:', localStorage.getItem('user'));
        
        // NO guardar en localStorage - solo crear el usuario
        // El localStorage debe mantenerse con el usuario admin actual
        
        // Mostrar mensaje de éxito
        this.utilsSvc.presentToast({
          message: 'Usuario creado exitosamente',
          duration: 3000,
          color: 'success',
          position: 'top',
          icon: 'checkmark-circle'
        });

        // Limpiar formulario
        this.form.reset();
        
        // NO navegar - mantener al admin en la página de crear usuario
        // El admin puede crear múltiples usuarios sin perder su sesión
      
      }).catch(error => {
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
      
      }).finally(() => {
        loading.dismiss();
      })
    } else {
      console.log('Formulario inválido');
      this.form.markAllAsTouched();
    }
  }

}
