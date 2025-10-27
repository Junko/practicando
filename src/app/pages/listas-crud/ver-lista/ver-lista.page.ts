import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firebase } from 'src/app/services/firebase';
import { Utils } from 'src/app/services/utils';

@Component({
  selector: 'app-ver-lista',
  templateUrl: './ver-lista.page.html',
  styleUrls: ['./ver-lista.page.scss'],
  standalone: false,
})
export class VerListaPage implements OnInit {
  
  lista: any = null;
  loading = true;

  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadLista();
  }

  async loadLista() {
    try {
      const listaId = this.route.snapshot.paramMap.get('id');
      
      if (!listaId) {
        await this.utilsSvc.presentToast({
          message: 'ID de lista no encontrado',
          duration: 2000,
          color: 'danger'
        });
        this.router.navigate(['/listas-crud']);
        return;
      }

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.lista = await this.firebaseSvc.getListaUtilesById(listaId);
      
      await loading.dismiss();
      this.loading = false;

      if (!this.lista) {
        await this.utilsSvc.presentToast({
          message: 'Lista no encontrada',
          duration: 2000,
          color: 'danger'
        });
        this.router.navigate(['/listas-crud']);
      }

      console.log('Lista cargada:', this.lista);
    } catch (error) {
      console.error('Error al cargar lista:', error);
      this.loading = false;
      await this.utilsSvc.presentToast({
        message: 'Error al cargar la lista',
        duration: 2000,
        color: 'danger'
      });
      this.router.navigate(['/listas-crud']);
    }
  }

  goBack() {
    this.router.navigate(['/listas-crud']);
  }

}
