import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firebase } from '../../../services/firebase';
import { HttpClient } from '@angular/common/http';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {

  estados = [
    { label: 'En buen estado', value: 'bueno' },
    { label: 'Faltante', value: 'faltante' },
    { label: 'Dañado', value: 'danado' }
  ];

  nivel!: string;
  grado!: string;
  seccion!: string;
  muebles: any[] = [];
  aulaId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: Firebase,
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.nivel = decodeURIComponent(params['nivel'] || '');
      this.grado = decodeURIComponent(params['grado'] || '');
      this.seccion = decodeURIComponent(params['seccion'] || '');

      const resultado = await this.firebaseSvc.getMueblesByGradoYNivel(this.grado, this.nivel, this.seccion,);

      if (resultado) {
        this.aulaId = resultado.id;
        this.muebles = resultado.muebles || []; 
      }

      console.log('Muebles cargados:', this.muebles);
    });
  }

   async guardarInspeccion() {
    try {
      if (!this.aulaId) {
        console.warn('No se encontró el ID del aula.');
        return;
      }

      const db = getFirestore();
      const aulaRef = doc(db, 'aulas', this.aulaId);

      await updateDoc(aulaRef, {
        muebles: this.muebles,
        ultimaInspeccion: new Date() 
      });

      
    const toast = await this.toastController.create({
      message: 'Inspección actualizada con éxito',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
      console.log('Inspección guardada correctamente.');
    this.router.navigate(['/inspeccion-aula']);

    } catch (error) {
      console.error('Error al guardar inspección:', error);
      
    }
  }
}
