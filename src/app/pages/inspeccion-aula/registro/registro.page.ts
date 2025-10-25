import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {

  recursos = [
    { nombre: 'Pupitre H1005', estado: 'bueno', motivo: '', observacion: '' },
    { nombre: '1 pizarra', estado: 'bueno', motivo: '', observacion: '' }
  ];

  estados = [
    { label: 'En buen estado', value: 'bueno' },
    { label: 'Faltante', value: 'faltante' },
    { label: 'Dañada', value: 'danado' }
  ];

  constructor() { }

  ngOnInit() {}

  guardarInspeccion() {
    console.log('Datos de inspección:', this.recursos);
    // aquí podrías enviar los datos a tu API o servicio
  }
}
