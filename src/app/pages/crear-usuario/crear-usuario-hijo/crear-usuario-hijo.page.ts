import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Firebase } from 'src/app/services/firebase';
import { Utils } from 'src/app/services/utils';

interface Hijo {
  nombre: string;
  apellido: string;
  nivel: string;
  grado: string;
  seccion: string;
}

@Component({
  selector: 'app-crear-usuario-hijo',
  templateUrl: './crear-usuario-hijo.page.html',
  styleUrls: ['./crear-usuario-hijo.page.scss'],
  standalone: false,
})
export class CrearUsuarioHijoPage implements OnInit {

  hijo: Hijo = {
    nombre: '',
    apellido: '',
    nivel: '',
    grado: '',
    seccion: ''
  };

  hijos: Hijo[] = [];
  gradosDisponibles: string[] = [];

  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);

  constructor(
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Verificar que hay datos temporales válidos
    this.verificarDatosTemporales();
  }

  verificarDatosTemporales() {
    const tempData = this.firebaseSvc.getTempUserData();
    if (!tempData) {
      this.mostrarToast('No se encontraron datos temporales. Redirigiendo al registro de usuario.', 'warning');
      setTimeout(() => {
        this.router.navigate(['/crear-usuario']);
      }, 2000);
    }
  }

  guardarHijo() {
    // Validar que todos los campos estén llenos
    if (!this.hijo.nombre || !this.hijo.apellido || !this.hijo.nivel || !this.hijo.grado || !this.hijo.seccion) {
      this.mostrarToast('Por favor, complete todos los campos', 'warning');
      return;
    }

    // Agregar el hijo a la lista
    this.hijos.push({ ...this.hijo });

    // Limpiar el formulario
    this.hijo = {
      nombre: '',
      apellido: '',
      nivel: '',
      grado: '',
      seccion: ''
    };

    this.mostrarToast('Hijo guardado correctamente', 'success');
  }

  onNivelChange() {
    // Actualizar grados disponibles según el nivel seleccionado
    this.actualizarGradosDisponibles();
    // Limpiar grado y sección cuando cambie el nivel
    this.hijo.grado = '';
    this.hijo.seccion = '';
  }

  onGradoChange() {
    // Limpiar sección cuando cambie el grado
    this.hijo.seccion = '';
  }

  actualizarGradosDisponibles() {
    switch (this.hijo.nivel) {
      case 'Inicial':
        this.gradosDisponibles = ['3 años', '4 años', '5 años'];
        break;
      case 'Primaria':
        this.gradosDisponibles = ['1°', '2°', '3°', '4°', '5°', '6°'];
        break;
      case 'Secundaria':
        this.gradosDisponibles = ['1°', '2°', '3°', '4°', '5°'];
        break;
      default:
        this.gradosDisponibles = [];
    }
  }

  eliminarHijo(index: number) {
    this.hijos.splice(index, 1);
    this.mostrarToast('Hijo eliminado', 'success');
  }

  async registrarHijos() {
    if (this.hijos.length === 0) {
      this.mostrarToast('Debe agregar al menos un hijo', 'warning');
      return;
    }

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Completar el registro del usuario padre con la información de los hijos
      const resultado = await this.firebaseSvc.completarRegistroPadre(this.hijos);
      
      console.log('Registro de usuario padre completado:', resultado);
      
      await this.mostrarToast('Usuario padre registrado correctamente con sus hijos', 'success');
      
      // Navegar de vuelta a la página de crear usuario
      this.router.navigate(['/crear-usuario']);
      
    } catch (error) {
      console.error('Error al registrar hijos:', error);
      this.mostrarToast('Error al registrar los hijos', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  private async mostrarToast(message: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

}
