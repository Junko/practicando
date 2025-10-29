import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ver-usuario',
  templateUrl: './ver-usuario.page.html',
  styleUrls: ['./ver-usuario.page.scss'],
})
export class VerUsuarioPage implements OnInit {

  // Datos estáticos simples
  usuario = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+1 234 567 8900',
    tipo: 'Padre de Familia',
    fechaRegistro: '15 de Enero, 2024'
  };

  constructor() { }

  ngOnInit() {
  }

}
