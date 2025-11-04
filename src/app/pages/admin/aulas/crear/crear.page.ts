import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray} from '@angular/forms';
import { Firebase } from '../../../../services/firebase';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

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
  grados: string[] = [];

   constructor(private fb: FormBuilder, private firebaseSvc: Firebase, private toastController: ToastController, private router: Router) {}

    ngOnInit() {
    this.crearForm = this.fb.group({
      nombreAula: ['', Validators.required],
      tipoAula: [''],
      piso: [''],
      grado: [''],
      nivel: [''],
      seccion: [''],
      muebles: this.fb.array([])  
    });
  }

  // Getter para acceder fácil al FormArray
  get muebles() {
    return this.crearForm.get('muebles') as FormArray;
  }

  // Añadir mueble
  agregarMueble() {
    const nuevoMueble = this.fb.group({
      nombre: ['',Validators.required] ,
      estado: ['Bueno'] // valor por defecto
    });
    this.muebles.push(nuevoMueble);
  }

  //  Eliminar mueble
  eliminarMueble(index: number) {
    this.muebles.removeAt(index);
  }

  // Cuando presionas "Crear"
 
  async crear() {
    if (this.crearForm.invalid) {
      this.crearForm.markAllAsTouched();
      return;
    }

    const data = this.crearForm.value;

    console.log('Guardando:', data);

    try {
      await this.firebaseSvc.addDocument('aulas', data); 
      await this.mostrarToast();
      console.log('Aula guardada correctamente!');
      this.crearForm.reset();
      this.muebles.clear();
      this.router.navigate(['/admin/aulas']);

    } catch (error) {
      console.error('Error al guardar en Firebase:', error);
    }
  }

    actualizarGrados() {
    const nivel = this.crearForm.value.nivel;

    if (nivel === 'Inicial') {
      this.grados = ['3 años', '4 años', '5 años'];
    } else if (nivel === 'Primaria') {
      this.grados = ['1º', '2º', '3º', '4º', '5º', '6º'];
    } else if (nivel === 'Secundaria') {
      this.grados = ['1º', '2º', '3º', '4º', '5º'];
    } else {
      this.grados = [];
    }

    // Limpia el valor del grado anterior si cambia el nivel
    this.crearForm.patchValue({ grado: '' });
  }

  async mostrarToast() {
  const toast = await this.toastController.create({
    message: 'Aula guardada correctamente',
    duration: 2000,
    color: 'success'
  });
  await toast.present();
}
}