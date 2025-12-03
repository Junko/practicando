import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { TabsConfig } from 'src/app/shared/models/tab-config.model';
import { ADMIN_TABS_CONFIG } from 'src/app/shared/configs/tabs-configs';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';
import { AlertController } from '@ionic/angular';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReporteItem {
  id: string;
  titulo: string;
  aula: string;
  tipoRecurso: string;
  estado: string;
  cantidad?: number;
  motivo?: string;
}

@Component({
  selector: 'app-reporte-general',
  templateUrl: './reporte-general.page.html',
  styleUrls: ['./reporte-general.page.scss'],
  standalone: false
})
export class ReporteGeneralPage implements OnInit, OnDestroy {
  tabsConfig: TabsConfig = ADMIN_TABS_CONFIG;
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);
  alertCtrl = inject(AlertController);

  // Datos
  aulas: any[] = [];
  reportes: ReporteItem[] = [];
  reportesFiltrados: ReporteItem[] = [];
  
  // Filtros
  filtroTipoRecurso: string = 'Todos';
  filtroEstado: string = 'Todos';
  
  // Estados
  loading: boolean = false;
  unsubscribeAulas: any;

  // Tipos de recursos y estados disponibles
  tiposRecursos: string[] = ['Todos'];
  estadosDisponibles: string[] = ['Todos', 'Faltante', 'Dañado'];

  // Propiedades calculadas para estadísticas
  get totalFaltantes(): number {
    return this.reportesFiltrados.filter(r => r.estado === 'Faltante').length;
  }

  get totalDanados(): number {
    return this.reportesFiltrados.filter(r => r.estado === 'Dañado').length;
  }

  constructor() { }

  ngOnInit() {
    this.cargarDatos();
  }

  ngOnDestroy() {
    if (this.unsubscribeAulas) {
      this.unsubscribeAulas();
    }
  }

  async cargarDatos() {
    try {
      this.loading = true;
      
      // Cargar aulas con listener en tiempo real
      this.unsubscribeAulas = this.firebaseSvc.listenCollection('aulas', (data) => {
        this.aulas = data;
        this.procesarReportes();
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      await this.utilsSvc.presentToast({
        message: 'Error al cargar los datos',
        duration: 3000,
        color: 'danger'
      });
    } finally {
      this.loading = false;
    }
  }

  procesarReportes() {
    this.reportes = [];
    const tiposSet = new Set<string>();

    this.aulas.forEach((aula: any) => {
      const nombreAula = aula.nombreAula || `${aula.grado || ''} ${aula.nivel || ''} ${aula.seccion || ''}`.trim() || 'Aula sin nombre';
      const muebles = aula.muebles || [];

      muebles.forEach((mueble: any) => {
        const estado = mueble.estado || 'bueno';
        
        // Solo agregar al reporte si hay problemas
        if (estado === 'faltante' || estado === 'danado') {
          // Intentar determinar el tipo de recurso desde el nombre o usar un valor por defecto
          const tipoRecurso = mueble.tipo || mueble.categoria || this.inferirTipoRecurso(mueble.nombre) || 'Recurso';
          tiposSet.add(tipoRecurso);

          const reporteItem: ReporteItem = {
            id: `${aula.id}_${mueble.nombre || 'mueble'}_${Date.now()}`,
            titulo: this.generarTitulo(mueble, estado),
            aula: nombreAula,
            tipoRecurso: tipoRecurso,
            estado: estado === 'faltante' ? 'Faltante' : 'Dañado',
            cantidad: mueble.cantidad || 1,
            motivo: mueble.motivo || mueble.motivoDanoFalta || mueble.observacion || mueble.observaciones || ''
          };

          this.reportes.push(reporteItem);
        }
      });
    });

    // Actualizar lista de tipos de recursos
    this.tiposRecursos = ['Todos', ...Array.from(tiposSet).sort()];
    
    // Aplicar filtros
    this.aplicarFiltros();
  }

  inferirTipoRecurso(nombre: string): string {
    if (!nombre) return 'Recurso';
    
    const nombreLower = nombre.toLowerCase();
    
    // Categorías comunes
    if (nombreLower.includes('computadora') || nombreLower.includes('laptop') || nombreLower.includes('pc')) {
      return 'Tecnología';
    }
    if (nombreLower.includes('mesa') || nombreLower.includes('escritorio')) {
      return 'Mobiliario';
    }
    if (nombreLower.includes('silla') || nombreLower.includes('asiento')) {
      return 'Mobiliario';
    }
    if (nombreLower.includes('pizarra') || nombreLower.includes('pizarrón')) {
      return 'Equipamiento';
    }
    if (nombreLower.includes('proyector') || nombreLower.includes('pantalla')) {
      return 'Tecnología';
    }
    
    return 'Recurso';
  }

  generarTitulo(mueble: any, estado: string): string {
    const nombre = mueble.nombre || 'Recurso';
    const cantidad = mueble.cantidad || 1;
    const estadoTexto = estado === 'faltante' ? 'faltante' : estado === 'danado' ? 'dañado' : '';
    
    if (cantidad > 1) {
      return `${cantidad} ${nombre} ${estadoTexto}s`;
    } else {
      return `${cantidad} ${nombre} ${estadoTexto}`;
    }
  }

  aplicarFiltros() {
    let filtrados = [...this.reportes];

    // Filtro por tipo de recurso
    if (this.filtroTipoRecurso !== 'Todos') {
      filtrados = filtrados.filter(r => r.tipoRecurso === this.filtroTipoRecurso);
    }

    // Filtro por estado
    if (this.filtroEstado !== 'Todos') {
      filtrados = filtrados.filter(r => r.estado === this.filtroEstado);
    }

    this.reportesFiltrados = filtrados;
  }

  async seleccionarFiltroTipoRecurso() {
    const alert = await this.alertCtrl.create({
      header: 'Tipo de recurso',
      inputs: this.tiposRecursos.map(tipo => ({
        type: 'radio',
        label: tipo,
        value: tipo,
        checked: tipo === this.filtroTipoRecurso
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aplicar',
          handler: (value) => {
            if (value) {
              this.filtroTipoRecurso = value;
              this.aplicarFiltros();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async seleccionarFiltroEstado() {
    const alert = await this.alertCtrl.create({
      header: 'Estado',
      inputs: this.estadosDisponibles.map(estado => ({
        type: 'radio',
        label: estado,
        value: estado,
        checked: estado === this.filtroEstado
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aplicar',
          handler: (value) => {
            if (value) {
              this.filtroEstado = value;
              this.aplicarFiltros();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async generarPDF() {
    try {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Crear nuevo documento PDF
      const doc = new jsPDF.default();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let yPosition = 20;

      // Encabezado
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte General de Inspección', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const fecha = new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Generado el: ${fecha}`, pageWidth / 2, yPosition, { align: 'center' });

      // Información de filtros aplicados
      yPosition += 12;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      let filtrosTexto = 'Filtros aplicados: ';
      if (this.filtroTipoRecurso !== 'Todos') {
        filtrosTexto += `Tipo: ${this.filtroTipoRecurso}`;
      }
      if (this.filtroEstado !== 'Todos') {
        if (this.filtroTipoRecurso !== 'Todos') filtrosTexto += ', ';
        filtrosTexto += `Estado: ${this.filtroEstado}`;
      }
      if (this.filtroTipoRecurso === 'Todos' && this.filtroEstado === 'Todos') {
        filtrosTexto += 'Ninguno (todos los reportes)';
      }
      
      // Dividir texto largo en múltiples líneas si es necesario
      const splitFiltros = doc.splitTextToSize(filtrosTexto, pageWidth - (margin * 2));
      doc.text(splitFiltros, margin, yPosition);
      yPosition += splitFiltros.length * 5 + 5;

      // Resumen estadístico
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumen', margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total de problemas encontrados: ${this.reportesFiltrados.length}`, margin + 5, yPosition);
      yPosition += 5;
      doc.text(`Faltantes: ${this.totalFaltantes}`, margin + 5, yPosition);
      yPosition += 5;
      doc.text(`Dañados: ${this.totalDanados}`, margin + 5, yPosition);
      yPosition += 8;

      // Tabla de reportes
      if (this.reportesFiltrados.length > 0) {
        const tableData = this.reportesFiltrados.map((reporte, index) => [
          index + 1,
          reporte.titulo || 'Sin título',
          reporte.aula || 'Sin aula',
          reporte.tipoRecurso || 'Sin tipo',
          reporte.estado || 'Sin estado',
          reporte.motivo || 'Sin motivo especificado'
        ]);

        // Calcular ancho disponible (página A4 = 210mm, menos márgenes)
        const availableWidth = pageWidth - (margin * 2);
        
        autoTable(doc, {
          startY: yPosition,
          head: [['#', 'Problema', 'Aula', 'Tipo', 'Estado', 'Motivo']],
          body: tableData,
          theme: 'striped',
          headStyles: {
            fillColor: [255, 208, 64], // Color amarillo similar al tema
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 9,
            halign: 'center'
          },
          bodyStyles: {
            fontSize: 8,
            textColor: [0, 0, 0],
            cellPadding: 2
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250]
          },
          columnStyles: {
            0: { 
              cellWidth: availableWidth * 0.05, // 5% - Número
              halign: 'center',
              valign: 'middle'
            },
            1: { 
              cellWidth: availableWidth * 0.25, // 25% - Problema
              halign: 'left',
              valign: 'top'
            },
            2: { 
              cellWidth: availableWidth * 0.15, // 15% - Aula
              halign: 'left',
              valign: 'top'
            },
            3: { 
              cellWidth: availableWidth * 0.12, // 12% - Tipo
              halign: 'left',
              valign: 'top'
            },
            4: { 
              cellWidth: availableWidth * 0.13, // 13% - Estado
              halign: 'center',
              valign: 'middle'
            },
            5: { 
              cellWidth: availableWidth * 0.30, // 30% - Motivo
              halign: 'left',
              valign: 'top'
            }
          },
          margin: { left: margin, right: margin, top: yPosition },
          styles: {
            overflow: 'linebreak',
            cellPadding: 2,
            lineWidth: 0.1,
            lineColor: [200, 200, 200],
            valign: 'top',
            minCellHeight: 8
          },
          tableWidth: 'wrap',
          showHead: 'everyPage',
          showFoot: 'never'
        });
      } else {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.text('No hay problemas reportados con los filtros aplicados.', margin, yPosition);
      }

      // Pie de página
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(
          `Página ${i} de ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Generar nombre del archivo
      const fileName = `reporte-inspeccion-${new Date().toISOString().split('T')[0]}.pdf`;

      // Guardar el PDF
      doc.save(fileName);

      await loading.dismiss();

      await this.utilsSvc.presentToast({
        message: 'PDF generado exitosamente',
        duration: 2000,
        color: 'success'
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      await this.utilsSvc.presentToast({
        message: 'Error al generar el PDF',
        duration: 3000,
        color: 'danger'
      });
    }
  }

  limpiarFiltros() {
    this.filtroTipoRecurso = 'Todos';
    this.filtroEstado = 'Todos';
    this.aplicarFiltros();
  }
}

