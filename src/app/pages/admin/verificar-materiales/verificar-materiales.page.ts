import { Component, OnInit, inject } from '@angular/core';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';
import { ADMIN_TABS_CONFIG } from '../../../shared/configs/tabs-configs';
import { TabsConfig } from '../../../shared/models/tab-config.model';

@Component({
  selector: 'app-verificar-materiales',
  templateUrl: './verificar-materiales.page.html',
  styleUrls: ['./verificar-materiales.page.scss'],
  standalone: false
})
export class VerificarMaterialesPage implements OnInit {

  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;

  // Búsqueda
  searchTerm: string = '';
  filtroGrado: string = '';
  filtroNivel: string = '';
  filtroSeccion: string = '';
  
  // Lista de estudiantes
  estudiantes: any[] = [];
  estudiantesFiltrados: any[] = [];
  estudianteSeleccionado: any = null;
  
  // Lista de materiales
  lista: any = null;
  materiales: any[] = [];
  verificaciones: any = {}; // Mapa de verificaciones por materialIndex
  
  // Estados
  loading: boolean = false;
  mostrandoMateriales: boolean = false;

  constructor() { }

  ngOnInit() {
    this.cargarTodosEstudiantes();
  }

  // Cargar todos los estudiantes inicialmente
  async cargarTodosEstudiantes() {
    try {
      this.loading = true;
      this.estudiantes = await this.firebaseSvc.getCollection('estudiantes');
      this.filtrarEstudiantes(); // Aplicar filtros iniciales
      this.loading = false;
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      this.loading = false;
      await this.utilsSvc.presentToast({
        message: 'Error al cargar estudiantes',
        duration: 2000,
        color: 'danger'
      });
    }
  }

  // Filtrar estudiantes en tiempo real
  filtrarEstudiantes() {
    this.estudiantesFiltrados = this.estudiantes.filter((estudiante: any) => {
      // Filtrar por nombre
      const nombre = estudiante.nombre || estudiante.nombres || '';
      const apellido = estudiante.apellido || estudiante.apellidos || '';
      const nombreCompleto = `${nombre} ${apellido}`.toLowerCase();
      const matchesSearch = !this.searchTerm.trim() || 
        nombreCompleto.includes(this.searchTerm.toLowerCase().trim());

      // Filtrar por nivel (normalizar comparación: Inicial/inicial, Primaria/primaria, etc.)
      let matchesNivel = true;
      if (this.filtroNivel) {
        const nivelEstudiante = (estudiante.nivel || '').toLowerCase();
        const nivelFiltro = this.filtroNivel.toLowerCase();
        matchesNivel = nivelEstudiante === nivelFiltro;
      }

      // Filtrar por grado (comparación exacta)
      const matchesGrado = !this.filtroGrado || estudiante.grado === this.filtroGrado;

      // Filtrar por sección (comparación exacta, case-insensitive)
      let matchesSeccion = true;
      if (this.filtroSeccion) {
        const seccionEstudiante = (estudiante.seccion || '').toString().toUpperCase();
        const seccionFiltro = this.filtroSeccion.toUpperCase();
        matchesSeccion = seccionEstudiante === seccionFiltro;
      }

      return matchesSearch && matchesNivel && matchesGrado && matchesSeccion;
    });
    
    // Debug: mostrar cuántos estudiantes se encontraron
    console.log(`Filtros aplicados - Búsqueda: "${this.searchTerm}", Nivel: "${this.filtroNivel}", Grado: "${this.filtroGrado}", Sección: "${this.filtroSeccion}"`);
    console.log(`Total estudiantes: ${this.estudiantes.length}, Filtrados: ${this.estudiantesFiltrados.length}`);
  }

  // Evento cuando cambia el searchbar
  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.filtrarEstudiantes();
  }

  // Limpiar filtros
  limpiarFiltros() {
    this.searchTerm = '';
    this.filtroGrado = '';
    this.filtroNivel = '';
    this.filtroSeccion = '';
    this.filtrarEstudiantes();
  }

  // Cuando cambia un filtro
  onFilterChange() {
    this.filtrarEstudiantes();
  }

  // Seleccionar estudiante y cargar sus materiales
  async seleccionarEstudiante(estudiante: any) {
    try {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.estudianteSeleccionado = estudiante;
      
      // Cargar lista de útiles según el grado y nivel del estudiante
      if (estudiante.grado && estudiante.nivel) {
        this.lista = await this.firebaseSvc.getListaByGradoYNivel(
          estudiante.grado,
          estudiante.nivel
        );
        
        if (this.lista && this.lista.materiales) {
          // Cargar verificaciones existentes
          const verificacionesExistentes = await this.firebaseSvc.getVerificacionesByEstudiante(estudiante.id);
          
          // Crear mapa de verificaciones
          this.verificaciones = {};
          verificacionesExistentes.forEach((ver: any) => {
            if (ver.listaId === this.lista.id) {
              this.verificaciones[ver.materialIndex] = {
                cantidadEntregada: ver.cantidadEntregada || 0,
                entregado: ver.entregado || false
              };
            }
          });

          // Inicializar materiales con estado de verificación y cantidades
          this.materiales = this.lista.materiales.map((material: any, index: number) => {
            const verificacion: any = verificacionesExistentes.find((v: any) => v.listaId === this.lista.id && v.materialIndex === index);
            const cantidadEntregada = verificacion?.cantidadEntregada || 0;
            return {
              ...material,
              index: index,
              cantidadEntregada: cantidadEntregada,
              entregado: cantidadEntregada >= material.cantidad,
              verificado: verificacion !== undefined
            };
          });
        } else {
          this.materiales = [];
        }
      } else {
        this.lista = null;
        this.materiales = [];
      }

      await loading.dismiss();
      this.mostrandoMateriales = true;

      if (!this.lista) {
        await this.utilsSvc.presentToast({
          message: 'No se encontró lista de útiles para este estudiante',
          duration: 2000,
          color: 'warning'
        });
      }
    } catch (error) {
      console.error('Error al cargar materiales:', error);
      await this.utilsSvc.presentToast({
        message: 'Error al cargar materiales',
        duration: 2000,
        color: 'danger'
      });
    }
  }

  // Volver a la lista de estudiantes
  volverALista() {
    this.estudianteSeleccionado = null;
    this.lista = null;
    this.materiales = [];
    this.verificaciones = {};
    this.mostrandoMateriales = false;
  }

  // Incrementar cantidad
  incrementarCantidad(material: any) {
    if (material.cantidadEntregada < material.cantidad) {
      material.cantidadEntregada = (material.cantidadEntregada || 0) + 1;
      this.actualizarCantidadEntregada(material);
    }
  }

  // Decrementar cantidad
  decrementarCantidad(material: any) {
    if (material.cantidadEntregada > 0) {
      material.cantidadEntregada = material.cantidadEntregada - 1;
      this.actualizarCantidadEntregada(material);
    }
  }

  // Actualizar cantidad entregada de un material
  async actualizarCantidadEntregada(material: any) {
    try {
      if (!this.estudianteSeleccionado || !this.lista) {
        return;
      }

      // Validar que la cantidad entregada no sea mayor a la solicitada
      if (material.cantidadEntregada > material.cantidad) {
        material.cantidadEntregada = material.cantidad;
        await this.utilsSvc.presentToast({
          message: `La cantidad entregada no puede ser mayor a ${material.cantidad}`,
          duration: 2000,
          color: 'warning'
        });
        return;
      }

      // Validar que no sea negativa
      if (material.cantidadEntregada < 0) {
        material.cantidadEntregada = 0;
      }

      // Actualizar estado de entregado basado en la cantidad
      material.entregado = material.cantidadEntregada >= material.cantidad;
      material.verificado = material.cantidadEntregada > 0 || material.entregado;

      // Guardar verificación en Firebase
      await this.firebaseSvc.guardarVerificacionMaterial(
        this.estudianteSeleccionado.id,
        this.lista.id,
        material.index,
        material.nombre_material,
        material.cantidadEntregada,
        material.cantidad
      );

      // Actualizar mapa de verificaciones
      this.verificaciones[material.index] = {
        cantidadEntregada: material.cantidadEntregada,
        entregado: material.entregado
      };

    } catch (error) {
      console.error('Error al guardar verificación:', error);
      await this.utilsSvc.presentToast({
        message: 'Error al guardar verificación',
        duration: 2000,
        color: 'danger'
      });
    }
  }

  // Guardar todas las verificaciones
  async guardarTodasVerificaciones() {
    try {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      if (!this.estudianteSeleccionado || !this.lista) {
        await loading.dismiss();
        return;
      }

      // Guardar todas las verificaciones
      for (const material of this.materiales) {
        if (material.verificado || material.cantidadEntregada > 0) {
          await this.firebaseSvc.guardarVerificacionMaterial(
            this.estudianteSeleccionado.id,
            this.lista.id,
            material.index,
            material.nombre_material,
            material.cantidadEntregada || 0,
            material.cantidad
          );
        }
      }

      await loading.dismiss();
      await this.utilsSvc.presentToast({
        message: 'Verificaciones guardadas exitosamente',
        duration: 2000,
        color: 'success'
      });
    } catch (error) {
      console.error('Error al guardar verificaciones:', error);
      await this.utilsSvc.presentToast({
        message: 'Error al guardar verificaciones',
        duration: 2000,
        color: 'danger'
      });
    }
  }

  // Obtener estadísticas de verificación (considerando cantidades)
  getEstadisticas() {
    if (!this.materiales || this.materiales.length === 0) {
      return { total: 0, entregados: 0, pendientes: 0, porcentaje: 0, totalItems: 0, itemsEntregados: 0 };
    }

    const total = this.materiales.length;
    const entregados = this.materiales.filter((m: any) => m.entregado).length;
    const pendientes = total - entregados;
    const porcentaje = Math.round((entregados / total) * 100);

    // Calcular total de items solicitados vs entregados
    let totalItems = 0;
    let itemsEntregados = 0;
    this.materiales.forEach((m: any) => {
      totalItems += m.cantidad || 0;
      itemsEntregados += m.cantidadEntregada || 0;
    });

    return { total, entregados, pendientes, porcentaje, totalItems, itemsEntregados };
  }

}

