import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firebase } from '../services/firebase';
import { Utils } from '../services/utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-lista',
  templateUrl: './editar-lista.page.html',
  styleUrls: ['./editar-lista.page.scss'],
  standalone: false,
})
export class EditarListaPage implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);

  listaId: string = '';
  loading = false;
  editingMaterial: any = null; // Para controlar si estamos editando un material
  showMaterialForm = false; // Para mostrar/ocultar el formulario
  private isProgrammatic = false; // Evita que valueChanges limpie grado al cargar

  form = new FormGroup({
    id: new FormControl(''),
    nivel: new FormControl('', [Validators.required]),
    grado: new FormControl({ value: '', disabled: false }, [Validators.required]),
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

  materiales: any[] = [];

  ngOnInit() {
    this.listaId = this.route.snapshot.paramMap.get('id') || '';
    // Año por defecto
    this.form.get('anio')?.setValue(this.anioActual.toString());

  // Suscripción para opciones de grado
  this.form.get('nivel')?.valueChanges.subscribe(nivel => {
    this.updateGradosOptions(nivel as string);
    // Evitar limpiar grado cuando estamos cargando datos programáticamente
    if (!this.isProgrammatic) {
      this.form.get('grado')?.setValue('');
    }
  });

    if (this.listaId) this.loadLista();
  }

  async loadLista() {
    try {
      this.loading = true;
      const data: any = await this.firebaseSvc.getDocument(`listas_utiles/${this.listaId}`);
      if (data) {
        console.log('Datos cargados:', data);
        // Actualizar nivel → opciones de grado → grado sin limpiar
        this.isProgrammatic = true;
        this.form.get('nivel')?.setValue(data.nivel || '', { emitEvent: true });
        this.updateGradosOptions(data.nivel);
        this.form.get('grado')?.setValue(data.grado || '');
        this.form.get('anio')?.setValue(data.anio || '');
        this.isProgrammatic = false;
        
        this.materiales = Array.isArray(data.materiales) ? data.materiales : [];
        console.log('Materiales cargados:', this.materiales);
        console.log('Opciones de grado:', this.gradosOptions);
      }
    } catch (error) {
      console.error('Error al cargar lista:', error);
    } finally {
      this.loading = false;
    }
  }

  // Actualiza opciones de grado según nivel
  updateGradosOptions(nivel: string) {
    console.log('Actualizando opciones para nivel:', nivel);
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
    console.log('Opciones de grado actualizadas:', this.gradosOptions);
  }

  // Helpers de materiales (mismo patrón que crear-listas)
  clearMaterialForm() {
    this.materialForm.reset();
    this.editingMaterial = null;
    this.showMaterialForm = false;
  }

  showAddMaterialForm() {
    this.showMaterialForm = true;
    this.editingMaterial = null;
    this.materialForm.reset();
  }

  addMaterial() {
    if (this.materialForm.valid) {
      if (this.editingMaterial) {
        // Actualizar material existente
        const index = this.materiales.findIndex(m => m.id === this.editingMaterial.id);
        if (index > -1) {
          this.materiales[index] = {
            ...this.editingMaterial,
            nombre_material: this.materialForm.get('nombre_material')?.value,
            descripcion: this.materialForm.get('descripcion')?.value || '',
            cantidad: this.materialForm.get('cantidad')?.value,
            imagen: this.materialForm.get('imagen')?.value || ''
          };
        }
      } else {
        // Agregar nuevo material
        const material = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          id_lista: this.listaId,
          nombre_material: this.materialForm.get('nombre_material')?.value,
          descripcion: this.materialForm.get('descripcion')?.value || '',
          cantidad: this.materialForm.get('cantidad')?.value,
          imagen: this.materialForm.get('imagen')?.value || ''
        };
        this.materiales.push(material);
      }
      this.clearMaterialForm();
    } else {
      this.materialForm.markAllAsTouched();
    }
  }

  editMaterial(material: any) {
    this.editingMaterial = material;
    this.showMaterialForm = true;
    this.materialForm.patchValue(material);
  }

  deleteMaterial(material: any) {
    this.utilsSvc.confirm({ header: 'Eliminar item', message: `¿Eliminar "${material.nombre_material}"?`, confirmText: 'Eliminar' })
      .then(confirmed => {
        if (!confirmed) return;
        const index = this.materiales.findIndex(m => m.id === material.id);
        if (index > -1) this.materiales.splice(index, 1);
      });
  }

  async takeImage() {
    try {
      const dataUrl = (await this.utilsSvc.takePicture('Imagen del Item')).dataUrl;
      this.materialForm.controls.imagen.setValue(dataUrl);
    } catch (error) {
      console.error('Error al tomar imagen:', error);
    }
  }

  async guardar() {
    try {
      if (this.form.invalid || this.materiales.length === 0) {
        await this.utilsSvc.presentToast({ message: 'Completa los campos requeridos', duration: 1500, color: 'warning' });
        return;
      }
      this.loading = true;
      const payload = {
        nivel: this.form.get('nivel')?.value,
        grado: this.form.get('grado')?.value,
        anio: this.form.get('anio')?.value,
        titulo: `${this.form.get('grado')?.value} ${this.form.get('nivel')?.value} - ${this.form.get('anio')?.value}`,
        materiales: this.materiales,
        actualizadoEn: new Date()
      };
      await this.firebaseSvc.actualizarListaUtiles(this.listaId, payload);
      await this.utilsSvc.presentToast({ message: 'Lista actualizada', duration: 1500, color: 'success' });
      this.router.navigate(['/listas-crud']);
    } catch (e: any) {
      const mensajeError = e.message || 'Error al actualizar';
      await this.utilsSvc.presentToast({ message: mensajeError, duration: 3000, color: 'danger' });
    } finally {
      this.loading = false;
    }
  }

}
