# 📚 GUÍA DETALLADA DE EXPOSICIÓN - ANÁLISIS PROFUNDO DE ARCHIVOS

---

## 🔥 ARCHIVO 1: `src/app/services/firebase.ts`
**Propósito**: Servicio central para todas las operaciones con Firebase

### Funcionalidades Principales:

#### **AUTENTICACIÓN** (Líneas 35-117)
- **`signIn(user)`**: Inicia sesión usando Firebase Auth v9
- **`signUp(user)`**: Crea nuevo usuario en Authentication
- **`createUserComplete(userData)`**: Proceso completo:
  1. Crea usuario en Authentication
  2. Guarda perfil en Firestore (`users/{uid}`)
  3. Actualiza displayName
- **`completarRegistroPadre(hijos)`**: Para padres que agregan hijos:
  - Usa datos temporales de localStorage
  - Crea cuenta de Authentication
  - Guarda perfil del padre
  - Crea estudiantes asociados en colección `estudiantes`
- **`signOut()`**: Cierra sesión y limpia localStorage

#### **FIRESTORE - OPERACIONES BÁSICAS** (Líneas 25-33)
- **`setDocument(path, data)`**: Guarda/actualiza documento específico
- **`getDocument(path)`**: Obtiene un documento por ruta
- **`addDocument(path, data)`**: Agrega documento con ID auto-generado
- **`updateDocument(path, data)`**: Actualiza documento existente
- **`deleteDocument(path)`**: Elimina documento

#### **GESTIÓN DE USUARIOS** (Líneas 118-340)
- **`getAllUsers()`**: Obtiene todos los usuarios (para admin)
- **`deleteUserComplete(userId)`**: Elimina usuario completo:
  - Elimina de Firestore
  - Elimina estudiantes asociados
- **`getEstudiantesByPadreUid(padreUid)`**: Obtiene hijos de un padre

#### **LISTAS DE ÚTILES** (Líneas 341-409)
- **`guardarListaUtiles(data)`**: Guarda lista completa con materiales
- **`getAllListasUtiles()`**: Obtiene todas las listas
- **`getListaUtilesById(listaId)`**: Obtiene lista específica
- **`getListasUtilesByNivel(nivel)`**: Filtra por nivel educativo
- **`getListaByGradoYNivel(grado, nivel)`**: Para padres - obtiene lista específica

#### **STORAGE** (Líneas 290-300)
- **`uploadImage(path, data_url)`**: Sube imagen a Firebase Storage
- **`getFirePath(url)`**: Obtiene ruta completa de Storage

### **Puntos Clave para Exposición:**
1. ✅ Usa Firebase v9 (modular) en lugar de v8 (compat)
2. ✅ Separación entre Authentication y Firestore
3. ✅ Manejo de datos temporales en localStorage para flujo de registro padre
4. ✅ Validación de expiración de datos temporales (1 hora)

---

## 🛠️ ARCHIVO 2: `src/app/services/utils.ts`
**Propósito**: Utilidades reutilizables para toda la aplicación

### Métodos Principales:

#### **LOADING** (Líneas 15-17)
- **`loading()`**: Crea spinner de carga
- Uso: `const loading = await this.utilsSvc.loading(); await loading.present();`

#### **TOASTS** (Líneas 19-22)
- **`presentToast(opts)`**: Muestra mensajes temporales
- Opciones: message, duration, color, position, icon

#### **CONFIRMACIONES** (Líneas 24-37)
- **`confirm(options)`**: Muestra alerta de confirmación
- Retorna Promise<boolean> (true si confirma)

#### **LOCALSTORAGE** (Líneas 39-48)
- **`saveInLocalStorage(key, value)`**: Guarda datos (JSON.stringify)
- **`getFromLocalStorage(key)`**: Obtiene datos (JSON.parse)

#### **ROUTER** (Líneas 50-52)
- **`routerLink(url)`**: Helper para navegación

#### **CÁMARA** (Líneas 54-65)
- **`takePicture(promptLabelHeader)`**: Usa Capacitor Camera
- Retorna imagen en formato base64 (DataUrl)

### **Puntos Clave para Exposición:**
1. ✅ Servicio singleton (`providedIn: 'root'`)
2. ✅ Inyección de dependencias con `inject()`
3. ✅ Abstracción de funcionalidades comunes

---

## 🔐 ARCHIVO 3: `src/app/guards/auth-guard.ts`
**Propósito**: Protege rutas que requieren autenticación

### Funcionamiento:
1. **Verifica localStorage** (línea 31): Busca key `'user'`
2. **Valida estructura** (líneas 34-38): Verifica `uid` y `correo`
3. **Redirige si no autenticado** (línea 45): `window.location.href = '/login'`

### **Lógica de Validación:**
```typescript
const user = localStorage.getItem('user');
if (user) {
  const userParsed = JSON.parse(user);
  if (userParsed.uid && userParsed.correo) {
    return true; // ✅ Permitir acceso
  }
}
return false; // ❌ Bloquear y redirigir
```

### **Puntos Clave para Exposición:**
1. ✅ Guard funcional (CanActivateFn) - Angular 15+
2. ✅ Validación simple basada en localStorage
3. ✅ Manejo de localStorage corrupto
4. ✅ Logging para debugging

---

## 🔐 ARCHIVO 4: `src/app/guards/admin.guard.ts` y `padre.guard.ts`
**Propósito**: Protección basada en roles

### **admin.guard.ts**:
- Verifica que `user.rol === 'admin'`
- Bloquea si no es admin

### **padre.guard.ts**:
- Verifica que `user.rol === 'padre'`
- Bloquea si no es padre

### **Puntos Clave para Exposición:**
1. ✅ Seguridad basada en roles
2. ✅ Mismo patrón que auth-guard pero con validación de rol

---

## 👤 ARCHIVO 5: `src/app/pages/login/login.page.ts`
**Propósito**: Página de autenticación

### Flujo Completo:

#### **1. Inicialización** (líneas 22-27)
- Limpia formulario al cargar
- Usa Reactive Forms de Angular

#### **2. Submit del Formulario** (líneas 33-62)
```
Usuario ingresa credenciales
  ↓
Valida formulario (email, contraseña requeridos)
  ↓
Limpia localStorage anterior
  ↓
Muestra loading
  ↓
Llama a Firebase.signIn()
  ↓
Si exitoso → getUserInfo(uid)
Si error → Muestra toast de error
```

#### **3. Obtener Información del Usuario** (líneas 64-139)
```
getUserInfo(uid)
  ↓
Obtiene documento de Firestore: users/{uid}
  ↓
Guarda en localStorage como JSON
  ↓
Muestra toast de bienvenida
  ↓
Redirige según rol:
  - admin → /admin/inicio
  - padre → /padre/inicio
```

#### **4. Validaciones**:
- Si usuario no tiene perfil en Firestore → cierra sesión
- Si localStorage falla → muestra error
- Manejo de errores de conexión

### **Puntos Clave para Exposición:**
1. ✅ Separación entre Authentication y Firestore profile
2. ✅ Manejo de errores robusto
3. ✅ Redirección inteligente según rol
4. ✅ Limpieza de formulario en errores

---

## 🏠 ARCHIVO 6: `src/app/app.component.ts`
**Propósito**: Componente raíz - Control global de menús y autenticación

### Funcionalidades:

#### **1. Verificación de Autenticación** (líneas 32-54)
- Escucha cambios de ruta
- Verifica localStorage en cada navegación
- Actualiza estado de autenticación y rol

#### **2. Control de Menús** (líneas 56-63)
- **`shouldShowMenu()`**: Muestra menú si autenticado y no en login
- **`shouldShowAdminMenu()`**: Muestra menú admin si rol es admin
- **`shouldShowPadreMenu()`**: Muestra menú padre si rol es padre

#### **3. Navegación y Cierre de Sesión** (líneas 65-91)
- **`closeAllMenus()`**: Cierra todos los menús
- **`navigateAndCloseMenu(route)`**: Navega y cierra menús
- **`signOut()`**: Cierra sesión, limpia estado, redirige a login

### **Puntos Clave para Exposición:**
1. ✅ Control centralizado de menús por rol
2. ✅ Verificación reactiva de autenticación
3. ✅ Router outlets separados por tipo de usuario

---

## 📝 ARCHIVO 7: `src/app/models/user.model.ts`
**Propósito**: Definiciones de tipos TypeScript para usuarios

### Interfaces Principales:

#### **`User`** (líneas 1-9)
```typescript
{
  uid: string;              // ID único de Firebase
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;       // ⚠️ Solo para creación
  rol: 'padre' | 'admin';
  telefono?: string;        // Opcional
  creadoEn: Date;
}
```

#### **`CrearUsuario`** (líneas 39-46)
- Similar a User pero sin `uid` ni `creadoEn`
- Para formularios de creación

#### **`UsuarioPublico`** (líneas 48-56)
- Sin contraseña (seguridad)
- Para mostrar datos sin exponer información sensible

### Enums:
- **`RolUsuario`**: 'padre' | 'admin'
- **`NivelEducativo`**: 'Inicial' | 'Primaria' | 'Secundaria'
- **`TipoAula`**: 'regular' | 'compartido'
- **`TipoRecurso`**: 'mueble' | 'equipo'
- **`EstadoInspeccion`**: 'buen_estado' | 'faltante' | 'danado'

### **Puntos Clave para Exposición:**
1. ✅ Type safety con TypeScript
2. ✅ Interfaces separadas por caso de uso
3. ✅ Enums para valores constantes
4. ✅ Seguridad: no exponer contraseñas

---

## 📚 ARCHIVO 8: `src/app/pages/listas-crud/crear-listas/crear-listas.page.ts`
**Propósito**: Crear nuevas listas de útiles escolares

### Flujo Completo:

#### **1. Inicialización** (líneas 49-67)
- Establece año actual por defecto
- Suscripción a cambios de nivel → actualiza opciones de grado
- Habilita/deshabilita campo grado dinámicamente

#### **2. Gestión de Grados Dinámicos** (líneas 69-97)
```typescript
updateGradosOptions(nivel)
  ↓
Según nivel:
  - Inicial → ['3 años', '4 años', '5 años']
  - Primaria → ['1°', '2°', ..., '6°']
  - Secundaria → ['1°', '2°', ..., '5°']
```

#### **3. Gestión de Materiales** (líneas 107-161)
- **`addMaterial()`**: Agrega material al array local
- **`editMaterial()`**: Elimina y carga en formulario
- **`deleteMaterial()`**: Elimina del array
- **`takeImage()`**: Usa cámara de Capacitor

#### **4. Crear Lista** (líneas 163-211)
```
submit()
  ↓
Valida formulario y que haya materiales
  ↓
Muestra loading
  ↓
procesarMateriales() → Sube imágenes a Storage
  ↓
Prepara datos: nivel, grado, año, título, materiales
  ↓
Firebase.guardarListaUtiles()
  ↓
Muestra toast de éxito
  ↓
Navega a /listas-crud
```

#### **5. Procesamiento de Imágenes** (líneas 213-255)
- Intenta subir a Firebase Storage
- Si falla → guarda como base64
- Manejo de errores con logs detallados

### **Puntos Clave para Exposición:**
1. ✅ Formularios reactivos con validación
2. ✅ Formularios anidados (lista + materiales)
3. ✅ Lógica dinámica de grados según nivel
4. ✅ Manejo de imágenes con fallback
5. ✅ IDs únicos para materiales

---

## ✏️ ARCHIVO 9: `src/app/editar-lista/editar-lista.page.ts`
**Propósito**: Editar listas de útiles existentes

### Diferencias con Crear Lista:

#### **1. Carga de Datos** (líneas 58-77)
- Obtiene ID de la ruta (`route.snapshot.paramMap`)
- Carga lista existente de Firestore
- Llena formulario con datos existentes
- **Problema resuelto**: Evita limpiar grado al cargar (`isProgrammatic`)

#### **2. Actualización de Materiales** (líneas 139-171)
- Puede editar materiales existentes
- Mantiene IDs originales
- Actualiza array local antes de guardar

#### **3. Guardar Cambios** (líneas 198-222)
- Usa `updateDocument()` en lugar de `addDocument()`
- Agrega campo `actualizadoEn` con timestamp
- Navega de vuelta a `/listas-crud`

### **Puntos Clave para Exposición:**
1. ✅ Reutiliza lógica similar a crear pero con carga previa
2. ✅ Manejo inteligente de formularios reactivos
3. ✅ Actualización parcial (solo campos modificados)

---

## 👥 ARCHIVO 10: `src/app/pages/usuarios-crud/usuarios-crud.page.ts`
**Propósito**: CRUD completo de usuarios (solo admin)

### Funcionalidades:

#### **1. Cargar Usuarios** (líneas 38-61)
- Obtiene todos los usuarios con `getAllUsers()`
- Mapea datos de Firebase a formato de interfaz local
- Filtra según tipo (padres/admins)

#### **2. Filtrado y Búsqueda** (líneas 63-83)
- **Búsqueda**: Por nombre o email (case-insensitive)
- **Filtro**: Por tipo (padres/admins)
- **`filterUsers()`**: Aplica ambos filtros combinados

#### **3. Operaciones CRUD**:
- **Crear**: Navega a `/crear-usuario`
- **Ver**: Navega a `/info-usuario/{id}`
- **Editar**: (Por implementar) - `editUser()`
- **Eliminar**: (Líneas 102-141)
  - Muestra confirmación
  - Llama a `deleteUserComplete()`
  - Elimina estudiantes asociados
  - Actualiza lista local

### **Puntos Clave para Exposición:**
1. ✅ CRUD completo con validaciones
2. ✅ Búsqueda y filtrado en tiempo real
3. ✅ Confirmación antes de eliminar
4. ✅ Eliminación en cascada (usuario + estudiantes)

---

## 📖 ARCHIVO 11: `src/app/pages/padre/ver-materiales/ver-materiales.page.ts`
**Propósito**: Padres ven listas de útiles de sus hijos

### Flujo:

#### **1. Cargar Datos** (líneas 38-82)
```
Obtiene ID de estudiante de la ruta
  ↓
Carga estudiante de Firestore: estudiantes/{id}
  ↓
Obtiene grado y nivel del estudiante
  ↓
Busca lista con getListaByGradoYNivel()
  ↓
Inicializa estado de materiales (isOpen, entregado)
```

#### **2. Visualización** (líneas 84-96)
- Materiales en acordeones expandibles
- Estado de entrega (checkbox)
- Toggle de acordeones

#### **3. Funcionalidad**:
- **`toggleMaterial()`**: Expande/colapsa material
- **`onMaterialToggle()`**: Maneja cambio de estado "entregado"
- **`goBack()`**: Regresa al inicio del padre

### **Puntos Clave para Exposición:**
1. ✅ Vista específica para padres (solo lectura)
2. ✅ Búsqueda de lista por grado y nivel
3. ✅ UI interactiva con acordeones
4. ✅ Estado de entrega por material (preparado para persistir)

---

## 🧩 ARCHIVO 12: `src/app/shared/components/header/header.component.ts`
**Propósito**: Componente header reutilizable

### Inputs:
- **`title`**: Título del header (obligatorio)
- **`menuId`**: ID del menú a abrir (default: 'main-menu')
- **`showBackButton`**: Muestra botón de retroceso
- **`defaultHref`**: Ruta por defecto si no hay evento

### Outputs:
- **`backClick`**: Emite evento cuando se hace click en back

### Funcionalidades:
- **`goBack()`**: Usa Angular Location API para navegación
- Permite override con evento custom

### **Puntos Clave para Exposición:**
1. ✅ Componente reutilizable con inputs/outputs
2. ✅ Separación de responsabilidades
3. ✅ Compatible con navegación automática de Ionic

---

## 🎯 RESUMEN DE ARQUITECTURA PARA EXPOSICIÓN

### **Capas de la Aplicación:**

1. **Capa de Presentación**: Componentes (pages, shared)
2. **Capa de Lógica**: Servicios (Firebase, Utils)
3. **Capa de Seguridad**: Guards (auth, admin, padre)
4. **Capa de Datos**: Modelos (interfaces, enums)
5. **Capa de Persistencia**: Firebase (Firestore, Auth, Storage)

### **Flujo de Datos Típico:**
```
Usuario → Componente → Servicio → Firebase → Firestore
         ↓
    LocalStorage (sesión)
         ↓
    Guards (validación)
```

### **Patrones Utilizados:**
- ✅ **Lazy Loading**: Módulos cargados bajo demanda
- ✅ **Dependency Injection**: Servicios inyectados
- ✅ **Reactive Forms**: Formularios reactivos
- ✅ **Guard Pattern**: Protección de rutas
- ✅ **Service Pattern**: Lógica de negocio centralizada

---

## 📋 CHECKLIST PARA EXPOSICIÓN

### **Puntos a Explicar:**

1. ✅ **Stack Tecnológico**: Ionic + Angular + Firebase
2. ✅ **Arquitectura**: Módulos, servicios, guards
3. ✅ **Autenticación**: Firebase Auth + Firestore profile
4. ✅ **Roles**: Admin y Padre con permisos diferentes
5. ✅ **CRUD**: Usuarios, listas, aulas
6. ✅ **Seguridad**: Guards, validaciones
7. ✅ **Persistencia**: Firestore + LocalStorage
8. ✅ **Componentes Reutilizables**: Shared module
9. ✅ **Manejo de Errores**: Try-catch, toasts
10. ✅ **Experiencia de Usuario**: Loading, confirmaciones

---

## 🔍 ARCHIVOS ADICIONALES A REVISAR

Si necesitas más detalles, revisa:

1. **`src/app/models/estudiante.model.ts`**: Enums de grados por nivel
2. **`src/app/models/inspeccion-aula.model.ts`**: Modelo de inspecciones
3. **`src/app/pages/inspeccion-aula/inspeccion-aula.page.ts`**: Lógica de inspecciones
4. **`src/app/app-routing.module.ts`**: Rutas completas del sistema
5. **`src/app/shared/shared-module.ts`**: Exportación de componentes
