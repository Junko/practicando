import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { AppModule } from './app/app.module';

// Inicializar Firebase
initializeApp(environment.firebaseConfig);

// Inicializar PWA Elements
defineCustomElements(window);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
