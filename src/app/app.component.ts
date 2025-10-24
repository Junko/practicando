import { Component, inject } from '@angular/core';
import { Firebase } from './services/firebase';
import { Utils } from './services/utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  firebaseSvc = inject(Firebase);
  utilsSvc = inject(Utils);

  constructor() {}

  signOut() {
    this.firebaseSvc.signOut();
    this.utilsSvc.routerLink('/login');
  }
}
