import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';

interface User {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  rol: 'padre' | 'admin';
  creadoEn: any;
  registroCompleto?: boolean;
}

@Component({
  selector: 'app-ver-usuario',
  templateUrl: './ver-usuario.page.html',
  styleUrls: ['./ver-usuario.page.scss'],
  standalone: false
})
export class VerUsuarioPage implements OnInit {

  userId: string = '';
  user: User | null = null;
  loading = true;
  error = '';

  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (this.userId) {
      this.loadUser();
    } else {
      this.error = 'ID de usuario no válido';
      this.loading = false;
    }
  }

  async loadUser() {
    try {
      this.loading = true;
      this.error = '';
      
      // Obtener datos del usuario desde Firestore
      const userData = await this.firebaseSvc.getDocument(`users/${this.userId}`);
      
      if (userData) {
        this.user = {
          id: this.userId,
          nombres: userData.nombres || '',
          apellidos: userData.apellidos || '',
          correo: userData.correo || '',
          telefono: userData.telefono || '',
          rol: userData.rol || 'padre',
          creadoEn: userData.creadoEn || new Date(),
          registroCompleto: userData.registroCompleto || false
        };
      } else {
        this.error = 'Usuario no encontrado';
      }
      
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      this.error = 'Error al cargar la información del usuario';
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/usuarios-crud']);
  }

  editUser() {
    // Aquí puedes implementar la navegación a editar usuario
    console.log('Editar usuario:', this.user);
  }

  deleteUser() {
    // Aquí puedes implementar la eliminación del usuario
    console.log('Eliminar usuario:', this.user);
  }

  getRoleDisplayName(rol: string): string {
    return rol === 'padre' ? 'Padre de Familia' : 'Administrador';
  }

  getRoleColor(rol: string): string {
    return rol === 'padre' ? 'primary' : 'secondary';
  }

  formatDate(date: any): string {
    if (!date) return 'No disponible';
    
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha no válida';
    }
  }
}
