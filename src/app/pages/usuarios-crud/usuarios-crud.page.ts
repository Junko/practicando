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
  
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;
  
  
  users: User[] = [
    {
      id: '1',
      name: 'Paquito De Tal',
      email: 'paquito03@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      type: 'padres'
    },
    {
      id: '2',
      name: 'Sofia Lopez',
      email: 'sofialoz@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      type: 'padres'
    },
    {
      id: '3',
      name: 'Margarita Huscar',
      email: 'margaretdias@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      type: 'padres'
    },
    {
      id: '4',
      name: 'Rodolfo Romero',
      email: 'romerjorocajas@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      type: 'admins'
    },
    {
      id: '5',
      name: 'María García',
      email: 'maria.garcia@admin.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      type: 'admins'
    },
    {
      id: '6',
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      type: 'padres'
    }
  ];
  
  filteredUsers: User[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    this.filterUsers();
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
