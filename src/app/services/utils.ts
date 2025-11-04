import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastController, ToastOptions, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class Utils {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  alertCtrl = inject(AlertController);

  // === LOADING ===
  loading(){
    return this.loadingCtrl.create({spinner: 'crescent'})
  }

  async presentToast(opts?: ToastOptions){
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // === ALERT CONFIRM ===
  async confirm(options: { header?: string; message?: string; confirmText?: string; cancelText?: string; }) {
    const alert = await this.alertCtrl.create({
      header: options.header || 'Confirmar',
      message: options.message || '¿Estás seguro?',
      buttons: [
        { text: options.cancelText || 'Cancelar', role: 'cancel' },
        { text: options.confirmText || 'Eliminar', role: 'confirm' }
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }

  // === LOCAL STORAGE ===
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // === ROUTER ===
  routerLink(url: string) {
    return this.router.navigate([url]);
  }

  // === CAMERA ===
  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Tomar una foto'
    });
  }
  
}
