import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firebase } from '../services/firebase';
import { Utils } from '../services/utils';

interface UserInfo {
  uid: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  rol: string;
  creadoEn: any;
  registroCompleto?: boolean;
  completadoEn?: any;
}

interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  nivel: string;
  grado: string;
  seccion: string;
  padreUid: string;
  creadoEn: any;
}

@Component({
  selector: 'app-info-usuario',
  templateUrl: './info-usuario.page.html',
  styleUrls: ['./info-usuario.page.scss'],
  standalone: false,
})
export class InfoUsuarioPage implements OnInit, OnDestroy {

  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  
  userInfo: UserInfo | null = null;
  estudiantes: Estudiante[] = [];
  loading = true;
  error = false;
  private isDestroyed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      await this.loadUserInfo(uid);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  async loadUserInfo(uid: string) {
    try {
      this.loading = true;
      this.error = false;

      // Obtener información del usuario
      const userData = await this.firebaseSvc.getDocument(`users/${uid}`);
      
      if (!userData) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar si el componente sigue activo
      if (this.isDestroyed) return;

      this.userInfo = userData as UserInfo;

      // Si es un padre, obtener sus estudiantes
      if (this.userInfo.rol === 'padre') {
        const estudiantesData = await this.firebaseSvc.getEstudiantesByPadreUid(uid);
        
        // Verificar nuevamente si el componente sigue activo
        if (this.isDestroyed) return;
        
        this.estudiantes = estudiantesData as Estudiante[];
      }

      this.loading = false;

    } catch (error) {
      console.error('Error al cargar información del usuario:', error);
      this.error = true;
      this.loading = false;
      
      // Evitar mostrar toast si el componente ya no está activo
      if (!this.isDestroyed) {
        try {
          await this.utilsSvc.presentToast({
            message: 'Error al cargar la información del usuario',
            duration: 3000,
            color: 'danger'
          });
        } catch (toastError) {
          console.warn('No se pudo mostrar el toast:', toastError);
        }
      }
    }
  }

  goBack() {
    this.router.navigate(['/usuarios-crud']);
  }

  ngOnDestroy() {
    this.isDestroyed = true;
  }

  formatDate(date: any) {
    if (!date) return 'No disponible';
    
    try {
      let dateObj: Date;
      
      // Manejar diferentes tipos de fecha de Firestore
      if (date && typeof date.toDate === 'function') {
        // Timestamp de Firestore
        dateObj = date.toDate();
      } else if (date && typeof date.seconds === 'number') {
        // Objeto con seconds (otro formato de Firestore)
        dateObj = new Date(date.seconds * 1000);
      } else if (date instanceof Date) {
        // Ya es un objeto Date
        dateObj = date;
      } else if (typeof date === 'string' || typeof date === 'number') {
        // String o número
        dateObj = new Date(date);
      } else {
        return 'Formato de fecha no válido';
      }
      
      // Verificar si la fecha es válida
      if (isNaN(dateObj.getTime())) {
        return 'Fecha inválida';
      }
      
      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Error al formatear fecha:', error, date);
      return 'Error al formatear fecha';
    }
  }

}
