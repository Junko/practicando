import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/services/utils';
import { Firebase } from 'src/app/services/firebase';
import { Router } from '@angular/router';

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
    grado: new FormControl({ value: '', disabled: true }, [Validators.required]),
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
  firebaseSvc = inject(Firebase);

  constructor(private router: Router) { }

  ngOnInit() {
    // Establecer año actual por defecto
    this.form.get('anio')?.setValue(this.anioActual.toString());
    
    // Suscribirse a cambios en el nivel para actualizar grados
    this.form.get('nivel')?.valueChanges.subscribe(nivel => {
      this.updateGradosOptions(nivel);
      // Limpiar grado cuando cambie el nivel
      this.form.get('grado')?.setValue('');
      
      // Habilitar/deshabilitar el campo grado según si hay nivel seleccionado
      if (nivel) {
        this.form.get('grado')?.enable();
      } else {
        this.form.get('grado')?.disable();
      }
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
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID único más robusto
        id_lista: '', // Se asignará cuando se cree la lista
        nombre_material: this.materialForm.get('nombre_material')?.value,
        descripcion: this.materialForm.get('descripcion')?.value || '',
        cantidad: this.materialForm.get('cantidad')?.value,
        imagen: this.materialForm.get('imagen')?.value || ''
      };
      
      this.materiales.push(material);
      console.log('Material agregado:', material);
      console.log('Total materiales:', this.materiales.length);
      this.materialForm.reset();
    } else {
      this.materialForm.markAllAsTouched();
    }
  }

  // Editar material
  editMaterial(material: any) {
    // Eliminar el material del array antes de editarlo
    this.deleteMaterial(material);
    // Cargar los datos en el formulario
    this.materialForm.patchValue(material);
  }

  // Eliminar material
  deleteMaterial(material: any) {
    const index = this.materiales.findIndex(m => m.id === material.id);
    if (index > -1) {
      this.materiales.splice(index, 1);
      console.log('Material eliminado:', material.nombre_material);
      console.log('Total materiales:', this.materiales.length);
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
      let loading: any;
      try {
        loading = await this.utilsSvc.loading();
        await loading.present();
        
        // Preparar datos de la lista
        const listaData = {
          nivel: this.form.get('nivel')?.value,
          grado: this.form.get('grado')?.value,
          anio: this.form.get('anio')?.value,
          titulo: this.getListaTitle(),
          materiales: await this.procesarMateriales() // Procesar materiales con imágenes
        };
        
        // Guardar la lista en Firebase
        const listaId = await this.firebaseSvc.guardarListaUtiles(listaData);
        
        console.log('Lista guardada exitosamente con ID:', listaId);
        
        if (loading) await loading.dismiss();
        
        await this.utilsSvc.presentToast({
          message: 'Lista creada exitosamente',
          duration: 2000,
          color: 'success'
        });
        
        // Navegar de vuelta a la lista de listas
        this.router.navigate(['/listas-crud']);
        
      } catch (error) {
        console.error('Error al crear lista:', error);
        if (loading) await loading.dismiss();
        await this.utilsSvc.presentToast({
          message: 'Error al crear la lista',
          duration: 2000,
          color: 'danger'
        });
      }
    } else {
      console.log('Formulario inválido o sin materiales');
      this.form.markAllAsTouched();
      await this.utilsSvc.presentToast({
        message: 'Por favor completa todos los campos y agrega al menos un material',
        duration: 2000,
        color: 'warning'
      });
    }
  }

  // Procesar materiales y subir imágenes a Firebase Storage
  async procesarMateriales() {
    const materialesProcesados = [];
    
    for (let i = 0; i < this.materiales.length; i++) {
      const material = this.materiales[i];
      
      // Preparar datos del material
      const materialData = {
        nombre_material: material.nombre_material,
        descripcion: material.descripcion || '',
        cantidad: material.cantidad,
        imagen: ''
      };
      
      // Si hay imagen, intentar subirla a Firebase Storage
      // NOTA: Si Firebase Storage no está habilitado, se guardará como base64
      if (material.imagen) {
        try {
          console.log(`Intentando subir imagen para: ${material.nombre_material}`);
          const timestamp = Date.now();
          const imagePath = `materiales/${material.nombre_material}_${timestamp}.jpg`;
          
          const downloadURL = await this.firebaseSvc.uploadImage(imagePath, material.imagen);
          materialData.imagen = downloadURL;
          console.log(`✓ Imagen subida exitosamente a Firebase Storage. URL: ${downloadURL}`);
        } catch (error: any) {
          console.error('Error al subir imagen del material:', error);
          console.error('Detalles del error:', error.message);
          
          // Si falla la subida (Storage no habilitado o error de CORS), guardar como base64
          materialData.imagen = material.imagen;
          console.log('⚠ Imagen guardada como base64 (Firebase Storage no disponible)');
          console.log('💡 Para habilitar Firebase Storage: https://console.firebase.google.com/project/montesorri-app-v1/storage');
        }
      }
      
      materialesProcesados.push(materialData);
    }
    
    return materialesProcesados;
  }

}
