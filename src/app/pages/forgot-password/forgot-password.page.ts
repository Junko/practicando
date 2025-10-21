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
        const res = await this.firebaseSvc.sendRecoveryEmail(this.form.value.correo);
        console.log('Email de recuperación enviado:', res);
        
        this.utilsSvc.presentToast({
          message: 'Se ha enviado un email de recuperación a tu correo',
          duration: 3000,
          color: 'success',
          position: 'top',
          icon: 'mail'
        });

        // Redirigir al login después de enviar el email
        setTimeout(() => {
          this.utilsSvc.routerLink('/login');
        }, 2000);
        
      } catch (error: any) {
        console.error('Error al enviar email:', error);
        
        let errorMessage = 'Error al enviar el email de recuperación';
        
        // Verificar si es un error de usuario no registrado
        if (error.message && error.message.includes('no está registrado')) {
          errorMessage = 'El correo electrónico no está registrado en el sistema';
        }
        
        this.utilsSvc.presentToast({
          message: errorMessage,
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
