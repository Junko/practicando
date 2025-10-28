import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Mueble {
  nombre: string;
  estado: string;
}

@Component({
  selector: 'app-crear',
  templateUrl: './crear.page.html',
  styleUrls: ['./crear.page.scss'],
  standalone: false,
})
export class CrearPage implements OnInit {
  crearForm!: FormGroup;
  muebles: Mueble[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.crearForm = this.fb.group({
      nombreAula: ['', Validators.required],
      tipoAula: ['General', Validators.required],
      piso: [''],
      grado: ['3°', Validators.required],
      nivel: ['Inicial', Validators.required],
    });
  }

  agregarMueble() {
    const nuevo: Mueble = {
      nombre: 'Computadora 1',
      estado: 'Perfecto Estado'
    };
    this.muebles.push(nuevo);
  }

  crear() {
    if (this.crearForm.valid) {
      const datos = {
        ...this.crearForm.value,
        muebles: this.muebles
      };
      console.log('Datos creados:', datos);
    }
  }
}
