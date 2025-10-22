import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listas-crud',
  templateUrl: './listas-crud.page.html',
  styleUrls: ['./listas-crud.page.scss'],
  standalone: false,
})
export class ListasCrudPage implements OnInit {

  listas: any[] = []; // Aquí se cargarán las listas desde Firebase

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadListas();
  }

  loadListas() {
    // Aquí se cargarán las listas desde Firebase
    // Por ahora, datos de ejemplo
    this.listas = [
      {
        id: '1',
        name: 'Lista de Útiles Primaria',
        nivel: 'Primaria',
        grado: '1er Grado',
        anio: '2024',
        materiales: []
      },
      {
        id: '2', 
        name: 'Lista de Útiles Secundaria',
        nivel: 'Secundaria',
        grado: '1er Año',
        anio: '2024',
        materiales: []
      }
    ];
  }

  navigateToCreate() {
    this.router.navigate(['/listas-crud/crear-listas']);
  }

  editLista(lista: any) {
    console.log('Editar lista:', lista);
    // Aquí irá la lógica para editar
  }

  deleteLista(lista: any) {
    console.log('Eliminar lista:', lista);
    // Aquí irá la lógica para eliminar
  }

}
