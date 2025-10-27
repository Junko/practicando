import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {

  recursos = [
    { id: 1, nombre: 'Pupitre H1005', estado: 'bueno', motivo: '', observacion: '' },
    { id: 2, nombre: '1 pizarra', estado: 'bueno', motivo: '', observacion: '' }
  ];

  estados = [
    { label: 'En buen estado', value: 'bueno' },
    { label: 'Faltante', value: 'faltante' },
    { label: 'Dañada', value: 'danado' }
  ];

  nivel!: string;
  grado!: string;
  seccion!: string;

  constructor(private route: ActivatedRoute) {}
  


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nivel = params['nivel'];
      this.grado = params['grado'];
      this.seccion = params['seccion'];

      console.log('Datos recibidos:', this.nivel, this.grado, this.seccion);
    });
  }

  guardarInspeccion() {
    console.log('Guardar inspección ->', this.recursos);
    // aquí envías a tu API o servicio
  }

}
