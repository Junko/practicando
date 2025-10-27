import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) { }

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

  deleteUser(user: User) {
    console.log('Eliminar usuario:', user);
    // Aquí puedes mostrar un modal de confirmación y eliminar el usuario
    // this.presentDeleteConfirm(user);
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
