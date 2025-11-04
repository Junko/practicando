import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray} from '@angular/forms';
import { Firebase } from '../../../../services/firebase';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

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
  aulaId: string | null = null;
  secciones: string[] = []; 

   constructor(
    private fb: FormBuilder, 
    private firebaseSvc: Firebase, 
    private toastController: ToastController, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
        this.crearForm.get('tipoAula')?.valueChanges.subscribe((tipo) => {
          if (tipo && tipo !== 'General') {
            // Bloquea campos no aplicables
            this.crearForm.get('nivel')?.disable();
            this.crearForm.get('grado')?.disable();
            this.crearForm.get('seccion')?.disable();

            // Limpia valores previos
            this.crearForm.patchValue({
              nivel: '',
              grado: '',
              seccion: '',
            });
          } else {
            // Habilita si vuelve a ser "General"
            this.crearForm.get('nivel')?.enable();
            this.crearForm.get('grado')?.enable();
            this.crearForm.get('seccion')?.enable();
          }
        });
        this.route.queryParams.subscribe(async (params) => {
      if (params['id']) {
        this.aulaId = params['id'];
        await this.cargarAula(params['id']);
      }
    });
  }
  
    async cargarAula(id: string) {
        const aula = await this.firebaseSvc.getDocument(`aulas/${id}`);
        if (aula) {
          this.crearForm.patchValue({
            nombreAula: aula['nombreAula'],
            tipoAula: aula['tipoAula'],
            piso: aula['piso'],
            grado: aula['grado'],
            nivel: aula['nivel'],
            seccion: aula['seccion'],
    });
      this.actualizarGrados();

        this.crearForm.patchValue({
          grado: aula['grado'],
                                  });

    this.muebles.clear();
    if (aula['muebles'] && Array.isArray(aula['muebles'])) {
      aula['muebles'].forEach((m: any) => {
        this.muebles.push(
          this.fb.group({
            nombre: [m.nombre, Validators.required],
            estado: [m.estado],
          })
        );
      });
    }

     
    }
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
      if (this.aulaId) {
        // Modo edición
        await this.firebaseSvc.updateDocument(`aulas/${this.aulaId}`, data);
        await this.mostrarToast('Aula actualizada correctamente');
      } else {
        // Modo creación
        await this.firebaseSvc.addDocument('aulas', data);
        await this.mostrarToast('Aula creada correctamente');
      }

      this.crearForm.reset();
      this.muebles.clear();
      this.router.navigate(['/admin/aulas']);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  }

    actualizarGrados() {
    const nivel = this.crearForm.value.nivel;

    if (nivel === 'Inicial') {
      this.grados = ['3 años', '4 años', '5 años'];
      this.secciones = ['Rojo', 'Verde', 'Amarillo'];
    } else if (nivel === 'Primaria') {
      this.grados = ['1º', '2º', '3º', '4º', '5º', '6º'];
      this.secciones = ['A', 'B', 'C', 'D', 'E'];
    } else if (nivel === 'Secundaria') {
      this.grados = ['1º', '2º', '3º', '4º', '5º'];
      this.secciones = ['A', 'B', 'C', 'D', 'E'];
    } else {
      this.grados = [];
      this.secciones = [];
    }

    const gradoActual = this.crearForm.value.grado;
    if (!this.grados.includes(gradoActual)) {
      this.crearForm.patchValue({ grado: '' });
    }

    const seccionActual = this.crearForm.value.seccion;
    if (!this.secciones.includes(seccionActual)) {
      this.crearForm.patchValue({ seccion: '' });
    }
  }

async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'success',
    });
    await toast.present();
  }
}