import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/services/utils';

@Component({
  selector: 'app-crear-listas',
  templateUrl: './crear-listas.page.html',
  styleUrls: ['./crear-listas.page.scss'],
  standalone: false,
})
export class CrearListasPage implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    nivel: new FormControl('', [Validators.required]),
    grado: new FormControl('', [Validators.required]),
    anio: new FormControl('', [Validators.required]),
  });

  // Opciones dinámicas para grados
  gradosOptions: any[] = [];
  anioActual = new Date().getFullYear();

  // Formulario para los materiales/útiles
  materialForm = new FormGroup({
    id: new FormControl(''),
    id_lista: new FormControl(''),
    nombre_material: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
    cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
    imagen: new FormControl(''),
  });

  materiales: any[] = []; // Array para almacenar los materiales

  utilsSvc = inject(Utils);

  constructor() { }

  ngOnInit() {
    // Establecer año actual por defecto
    this.form.get('anio')?.setValue(this.anioActual.toString());
    
    // Suscribirse a cambios en el nivel para actualizar grados
    this.form.get('nivel')?.valueChanges.subscribe(nivel => {
      this.updateGradosOptions(nivel);
      // Limpiar grado cuando cambie el nivel
      this.form.get('grado')?.setValue('');
    });
  }

  // Actualizar opciones de grados según el nivel
  updateGradosOptions(nivel: string) {
    switch(nivel) {
      case 'Inicial':
        this.gradosOptions = [
          { value: '3 años', label: '3 años' },
          { value: '4 años', label: '4 años' },
          { value: '5 años', label: '5 años' }
        ];
        break;
      case 'Primaria':
        this.gradosOptions = [
          { value: '1°', label: '1°' },
          { value: '2°', label: '2°' },
          { value: '3°', label: '3°' },
          { value: '4°', label: '4°' },
          { value: '5°', label: '5°' },
          { value: '6°', label: '6°' }
        ];
        break;
      case 'Secundaria':
        this.gradosOptions = [
          { value: '1°', label: '1°' },
          { value: '2°', label: '2°' },
          { value: '3°', label: '3°' },
          { value: '4°', label: '4°' },
          { value: '5°', label: '5°' }
        ];
        break;
      default:
        this.gradosOptions = [];
    }
  }

  // Generar título de la lista
  getListaTitle(): string {
    const nivel = this.form.get('nivel')?.value || '';
    const grado = this.form.get('grado')?.value || '';
    const anio = this.form.get('anio')?.value || '';
    return `${grado} ${nivel} - ${anio}`;
  }

  // Limpiar formulario de material
  clearMaterialForm() {
    this.materialForm.reset();
  }

  // Agregar material a la lista
  addMaterial() {
    if (this.materialForm.valid) {
      const material = {
        id: Date.now().toString(), // ID temporal
        id_lista: '', // Se asignará cuando se cree la lista
        nombre_material: this.materialForm.get('nombre_material')?.value,
        descripcion: this.materialForm.get('descripcion')?.value || '',
        cantidad: this.materialForm.get('cantidad')?.value,
        imagen: this.materialForm.get('imagen')?.value || ''
      };
      
      this.materiales.push(material);
      this.materialForm.reset();
    } else {
      this.materialForm.markAllAsTouched();
    }
  }

  // Editar material
  editMaterial(material: any) {
    this.materialForm.patchValue(material);
  }

  // Eliminar material
  deleteMaterial(material: any) {
    const index = this.materiales.indexOf(material);
    if (index > -1) {
      this.materiales.splice(index, 1);
    }
  }

  // Tomar imagen para el material
  async takeImage() {
    try {
      const dataUrl = (await this.utilsSvc.takePicture('Imagen del Item')).dataUrl;
      this.materialForm.controls.imagen.setValue(dataUrl);
    } catch (error) {
      console.error('Error al tomar imagen:', error);
    }
  }

  // Crear la lista completa
  async submit() {
    if (this.form.valid && this.materiales.length > 0) {
      const listaData = {
        ...this.form.value,
        titulo: this.getListaTitle(),
        materiales: this.materiales
      };
      
      console.log('Lista completa:', listaData);
      // Aquí irá la lógica para crear la lista en Firebase
    } else {
      console.log('Formulario inválido o sin materiales');
      this.form.markAllAsTouched();
    }
  }

}
