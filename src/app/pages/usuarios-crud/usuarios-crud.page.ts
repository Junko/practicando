import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Firebase } from '../../services/firebase';
import { Utils } from '../../services/utils';
import { ADMIN_TABS_CONFIG } from '../../shared/configs/tabs-configs';
import { TabsConfig } from '../../shared/models/tab-config.model';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: 'padres' | 'admins';
}

@Component({
  selector: 'app-usuarios-crud',
  templateUrl: './usuarios-crud.page.html',
  styleUrls: ['./usuarios-crud.page.scss'],
  standalone: false
})
export class UsuariosCrudPage implements OnInit {
  
  searchTerm: string = '';
  selectedFilter: string = 'padres';
  currentPage: string = 'usuario';
  loading = true;
  
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;
  
  users: User[] = [];
  filteredUsers: User[] = [];

  constructor(private router: Router, private alertCtrl: AlertController) { }

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.loading = true;
      const usersData = await this.firebaseSvc.getAllUsers();
      
      // Mapear los datos de Firebase al formato esperado
      this.users = usersData.map((user: any) => ({
        id: user.id || user.uid,
        name: `${user.nombres} ${user.apellidos}`,
        email: user.correo,
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        type: user.rol === 'padre' ? 'padres' : 'admins'
      }));
      
      this.filterUsers();
      this.loading = false;
      
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.loading = false;
      await this.utilsSvc.presentToast({
        message: 'Error al cargar los usuarios',
        duration: 2000,
        color: 'danger'
      });
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.filterUsers();
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
    this.filterUsers();
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesFilter = user.type === this.selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }

  createUser() {
    this.router.navigate(['/crear-usuario']);
  }

  editUser(user: User) {
    console.log('Editar usuario:', user);
    // Aquí puedes navegar a la página de editar usuario
    // this.router.navigate(['/editar-usuario', user.id]);
  }

  viewUser(user: User) {
    console.log('Ver usuario:', user);
    this.router.navigate(['/info-usuario', user.id]);
  }

  async deleteUser(user: User) {
    const alert = await this.alertCtrl.create({
      header: '⚠️ Eliminar usuario',
      message: `¿Estás seguro de que deseas eliminar a "${user.name}"?\n\nEsta acción no se puede deshacer`,
      cssClass: 'alert-delete',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              this.loading = true;
              await this.firebaseSvc.deleteUserComplete(user.id);
              this.users = this.users.filter(u => u.id !== user.id);
              this.filterUsers();
              this.loading = false;
              await this.utilsSvc.presentToast({
                message: 'Usuario eliminado completamente',
                duration: 2000,
                color: 'success'
              });
            } catch (error) {
              console.error('Error al eliminar usuario:', error);
              this.loading = false;
              await this.utilsSvc.presentToast({
                message: 'No se pudo eliminar el usuario',
                duration: 2000,
                color: 'danger'
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  navigateTo(page: string) {
    this.currentPage = page;
    console.log('Navegar a:', page);
    // Aquí puedes implementar la navegación real
    // this.router.navigate([`/${page}`]);
  }

  signOut() {
    this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/login');
  }
}
