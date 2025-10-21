import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Firebase } from 'src/app/services/firebase';
import { Utils } from 'src/app/services/utils';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email])
  })

  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils)

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        // Verificar si el correo existe en el sistema
        const emailExists = await this.firebaseSvc.checkEmailExists(this.form.value.correo);
        
        if (emailExists) {
          // Si el correo existe, enviar el email de recuperación
          await this.firebaseSvc.sendRecoveryEmail(this.form.value.correo);
          
          this.utilsSvc.presentToast({
            message: 'Se ha enviado un email de recuperación a tu correo',
            duration: 4000,
            color: 'success',
            position: 'top',
            icon: 'mail'
          });
        } else {
          // Si el correo no existe, mostrar mensaje de error
          this.utilsSvc.presentToast({
            message: 'El correo electrónico no está registrado en nuestro sistema',
            duration: 4000,
            color: 'danger',
            position: 'top',
            icon: 'warning'
          });
        }
        
      } catch (error: any) {
        console.error('Error al procesar solicitud:', error);
        
        this.utilsSvc.presentToast({
          message: 'Error al procesar la solicitud. Inténtalo de nuevo.',
          duration: 4000,
          color: 'danger',
          position: 'top',
          icon: 'warning'
        });
        
      } finally {
        loading.dismiss();
      }
    } else {
      console.log('Formulario inválido');
      this.form.markAllAsTouched();
    }
  }

}
