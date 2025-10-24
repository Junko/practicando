import { Component, inject } from '@angular/core';
import { Firebase } from '../../../services/firebase';
import { Utils } from '../../../services/utils';

@Component({
  selector: 'app-padre-menu',
  templateUrl: './padre-menu.component.html',
  styleUrls: ['./padre-menu.component.scss']
})
export class PadreMenuComponent {
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);

  signOut() {
    this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/login');
  }
}
