import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { addIcons } from 'ionicons';
import { getFirestore } from 'firebase/firestore';
import { AppModule } from './app/app.module';

// Inicializar Firebase
initializeApp(environment.firebaseConfig);

// Inicializar PWA Elements
defineCustomElements(window);

// Registrar iconos globalmente
import { 
  homeOutline, 
  libraryOutline, 
  notificationsOutline, 
  personCircleOutline,
  home,
  list,
  people,
  person,
  barChart,
  checkboxOutline,
  menu,
  closeCircle,
  clipboardOutline,
  addCircleOutline
} from 'ionicons/icons';

addIcons({
  'home-outline': homeOutline,
  'library-outline': libraryOutline,
  'notifications-outline': notificationsOutline,
  'person-circle-outline': personCircleOutline,
  'home': home,
  'list': list,
  'people': people,
  'person': person,
  'bar-chart': barChart,
  'checkbox-outline': checkboxOutline,
  'menu': menu,
  'close-circle': closeCircle,
  'clipboard-outline': clipboardOutline,
  'add-circle-outline': addCircleOutline
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
