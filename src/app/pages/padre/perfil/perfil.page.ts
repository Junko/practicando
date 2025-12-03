import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';
import { PADRE_TABS_CONFIG } from '../../../shared/configs/tabs-configs';
import { TabsConfig } from '../../../shared/models/tab-config.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  userInfo: any = null;
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  tabsConfig: TabsConfig = PADRE_TABS_CONFIG;
  alertCtrl = inject(AlertController);
  hijos: any[] = [];

  // Formulario de edición
  editForm = new FormGroup({
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('')
  });

  isModalOpen: boolean = false;
  isPreviewModalOpen: boolean = false;
  loading: boolean = false;
  loadingFoto: boolean = false;
  previewImage: string = '';

  constructor() { }

  ngOnInit() {
    this.loadUserInfo();
    this.loadHijos();
  }

  loadUserInfo() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      // Cargar datos en el formulario
      this.editForm.patchValue({
        nombres: this.userInfo.nombres || '',
        apellidos: this.userInfo.apellidos || '',
        correo: this.userInfo.correo || this.userInfo.email || '',
        telefono: this.userInfo.telefono || ''
      });
      console.log('Usuario cargado:', this.userInfo);
    } else {
      console.error('No se encontró información del usuario');
    }
  }

  async loadHijos() {
    try {
      const uid = this.userInfo?.uid || this.userInfo?.user?.uid || this.userInfo?.id;
      if (!uid) return;
      this.hijos = await this.firebaseSvc.getEstudiantesByPadreUid(uid);
    } catch (e) {
      console.error('Error cargando hijos', e);
    }
  }

  // Abrir modal de edición
  abrirModalEditar() {
    // Cargar datos actuales en el formulario
    this.editForm.patchValue({
      nombres: this.userInfo.nombres || '',
      apellidos: this.userInfo.apellidos || '',
      correo: this.userInfo.correo || this.userInfo.email || '',
      telefono: this.userInfo.telefono || ''
    });
    this.isModalOpen = true;
  }

  // Cerrar modal
  cerrarModal() {
    this.isModalOpen = false;
    // Restaurar valores originales
    this.loadUserInfo();
  }

  // Guardar cambios
  async guardarCambios() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      await this.utilsSvc.presentToast({
        message: 'Por favor completa todos los campos requeridos',
        duration: 2000,
        color: 'warning'
      });
      return;
    }

    try {
      this.loading = true;
      const formValue = this.editForm.value;
      const cambios: any = {};
      let requierePassword = false;

      // Verificar qué campos cambiaron
      if (formValue.nombres !== this.userInfo.nombres) {
        cambios.nombres = formValue.nombres;
      }
      if (formValue.apellidos !== this.userInfo.apellidos) {
        cambios.apellidos = formValue.apellidos;
      }
      if (formValue.telefono !== (this.userInfo.telefono || '')) {
        cambios.telefono = formValue.telefono || '';
      }
      if (formValue.correo !== (this.userInfo.correo || this.userInfo.email)) {
        cambios.correo = formValue.correo;
        requierePassword = true;
      }

      // Si no hay cambios, no hacer nada
      if (Object.keys(cambios).length === 0) {
        this.cerrarModal();
        this.loading = false;
        await this.utilsSvc.presentToast({
          message: 'No se realizaron cambios',
          duration: 2000,
          color: 'warning'
        });
        return;
      }

      let passwordActual: string | undefined;

      // Si se cambia el correo, pedir contraseña
      if (requierePassword) {
        passwordActual = await this.solicitarPassword();
        if (!passwordActual) {
          this.loading = false;
          return; // Usuario canceló
        }
      }

      // Actualizar perfil
      await this.firebaseSvc.actualizarPerfilUsuario(
        this.userInfo.uid,
        cambios,
        passwordActual
      );

      // Actualizar localStorage
      const userActualizado = {
        ...this.userInfo,
        ...cambios
      };
      localStorage.setItem('user', JSON.stringify(userActualizado));
      this.userInfo = userActualizado;

      this.loading = false;
      this.cerrarModal();

      await this.utilsSvc.presentToast({
        message: 'Perfil actualizado exitosamente',
        duration: 2000,
        color: 'success'
      });

    } catch (error: any) {
      this.loading = false;
      console.error('Error al actualizar perfil:', error);
      await this.utilsSvc.presentToast({
        message: error.message || 'Error al actualizar el perfil',
        duration: 3000,
        color: 'danger'
      });
    }
  }

  // Solicitar contraseña para cambiar correo
  async solicitarPassword(): Promise<string | undefined> {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: 'Confirmar contraseña',
        message: 'Para cambiar el correo electrónico, necesitamos confirmar tu contraseña actual',
        inputs: [
          {
            name: 'password',
            type: 'password',
            placeholder: 'Contraseña actual'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(undefined);
            }
          },
          {
            text: 'Confirmar',
            handler: (data) => {
              if (data.password && data.password.trim()) {
                resolve(data.password);
              } else {
                resolve(undefined);
              }
            }
          }
        ]
      });

      await alert.present();
    });
  }

  // Cambiar foto de perfil
  async cambiarFotoPerfil() {
    try {
      const image = await this.utilsSvc.takePicture('Foto de Perfil');
      
      if (image && image.dataUrl) {
        // Mostrar vista previa
        this.previewImage = image.dataUrl;
        this.isPreviewModalOpen = true;
      }
    } catch (error: any) {
      console.error('Error al seleccionar imagen:', error);
      
      // Si el error es que el usuario canceló, no mostrar error
      const errorMessage = error.message || error.toString() || '';
      if (!errorMessage.toLowerCase().includes('cancel') && !errorMessage.toLowerCase().includes('cancelado')) {
        await this.utilsSvc.presentToast({
          message: 'Error al seleccionar la imagen',
          duration: 3000,
          color: 'danger'
        });
      }
    }
  }

  // Cerrar modal de vista previa
  cerrarPreviewModal() {
    this.isPreviewModalOpen = false;
    this.previewImage = '';
  }

  // Seleccionar otra imagen
  async seleccionarOtraImagen() {
    this.cerrarPreviewModal();
    // Esperar un momento para que se cierre el modal
    setTimeout(() => {
      this.cambiarFotoPerfil();
    }, 300);
  }

  // Confirmar y guardar la imagen
  async confirmarFoto() {
    if (!this.previewImage) return;

    let loading: any = null;
    try {
      loading = await this.utilsSvc.loading();
      await loading.present();

      this.loadingFoto = true;
      
      // Actualizar foto en Firebase
      await this.firebaseSvc.actualizarPerfilUsuario(
        this.userInfo.uid,
        { fotoPerfil: this.previewImage }
      );

      // Actualizar localStorage
      this.userInfo.fotoPerfil = this.previewImage;
      localStorage.setItem('user', JSON.stringify(this.userInfo));

      if (loading) {
        await loading.dismiss();
      }

      this.cerrarPreviewModal();

      await this.utilsSvc.presentToast({
        message: 'Foto de perfil actualizada exitosamente',
        duration: 2000,
        color: 'success'
      });

      this.loadingFoto = false;

    } catch (error: any) {
      this.loadingFoto = false;
      
      if (loading) {
        await loading.dismiss();
      }
      
      console.error('Error al guardar foto de perfil:', error);
      await this.utilsSvc.presentToast({
        message: 'Error al guardar la foto de perfil',
        duration: 3000,
        color: 'danger'
      });
    }
  }

  async logout() {
    try {
      await this.firebaseSvc.signOut();
    } finally {
      this.utilsSvc.routerLink('/login');
    }
  }

}
