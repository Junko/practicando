import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { addIcons } from 'ionicons';

import { AppModule } from './app/app.module';

// Inicializar Firebase
initializeApp(environment.firebaseConfig);

// Inicializar PWA Elements
defineCustomElements(window);

// Registrar iconos globalmente
addIcons({
  'home-outline': 'home-outline',
  'library-outline': 'library-outline',
  'notifications-outline': 'notifications-outline',
  'person-circle-outline': 'person-circle-outline',
  'home': 'home',
  'list': 'list',
  'people': 'people',
  'person': 'person',
  'bar-chart': 'bar-chart',
  'checkbox-outline': 'checkbox-outline',
  'menu': 'menu'
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
