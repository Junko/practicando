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

      this.firebaseSvc.sendRecoveryEmail(this.form.value.correo).then(res => {
        console.log('Email de recuperación enviado:', res);
        
        this.utilsSvc.presentToast({
          message: 'Se ha enviado un email de recuperación',
          duration: 3000,
          color: 'success',
          position: 'top',
          icon: 'mail'
        });
      
      }).catch(error => {
          console.error('Error al enviar email:', error);
          
          this.utilsSvc.presentToast({
            message: 'Error al enviar el email de recuperación',
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
