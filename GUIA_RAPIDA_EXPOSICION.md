# ⚡ GUÍA RÁPIDA DE EXPOSICIÓN - REFERENCIA RÁPIDA

---

## 🎯 ESTRUCTURA DEL PROYECTO EN 30 SEGUNDOS

```
Aplicación Móvil Web Híbrida
├── Frontend: Ionic 8 + Angular 20
├── Backend: Firebase (Firestore + Auth + Storage)
├── Roles: Admin y Padre
└── Funcionalidades: CRUD Usuarios, Listas Útiles, Inspecciones Aulas
```

---

## 📁 ARCHIVOS CLAVE Y SU FUNCIÓN

| Archivo | Función Principal | Ubicación |
|---------|------------------|-----------|
| **firebase.ts** | 🔥 Todas las operaciones con Firebase | `services/` |
| **utils.ts** | 🛠️ Utilidades (loading, toasts, cámara) | `services/` |
| **auth-guard.ts** | 🔐 Protege rutas autenticadas | `guards/` |
| **admin.guard.ts** | 🔐 Solo admin puede acceder | `guards/` |
| **login.page.ts** | 👤 Página de inicio de sesión | `pages/login/` |
| **app.component.ts** | 🏠 Control global de menús y sesión | `app/` |
| **user.model.ts** | 📝 Tipos TypeScript para usuarios | `models/` |
| **crear-listas.page.ts** | 📚 Crear listas de útiles | `pages/listas-crud/` |
| **editar-lista.page.ts** | ✏️ Editar listas existentes | `editar-lista/` |
| **usuarios-crud.page.ts** | 👥 CRUD de usuarios | `pages/usuarios-crud/` |
| **ver-materiales.page.ts** | 📖 Padres ven listas | `pages/padre/` |

---

## 🔄 FLUJOS PRINCIPALES

### 1️⃣ **LOGIN**
```
Usuario → Formulario → Firebase.signIn() → Firestore (perfil) 
→ localStorage → Redirección según rol
```

### 2️⃣ **CREAR LISTA**
```
Admin → Selecciona nivel → Grados dinámicos → Agrega materiales 
→ Sube imágenes → Guarda en Firestore
```

### 3️⃣ **VER MATERIALES (Padre)**
```
Padre → Selecciona hijo → Obtiene grado/nivel → Busca lista 
→ Muestra materiales con acordeones
```

---

## 🗂️ ESTRUCTURA DE COLECCIONES EN FIRESTORE

```
Firestore
├── users/{uid}
│   └── datos del usuario (nombres, correo, rol, etc.)
├── estudiantes/{id}
│   └── datos del estudiante (nombre, grado, nivel, padreUid)
├── listas_utiles/{id}
│   └── nivel, grado, año, materiales[]
└── inspecciones/{id}
    └── aula, inventario, estado, observaciones
```

---

## 🔑 CONCEPTOS CLAVE PARA EXPLICAR

### **1. Guards (Protección de Rutas)**
- `authGuard`: Verifica si está autenticado (localStorage)
- `adminGuard`: Verifica si es admin
- `padreGuard`: Verifica si es padre

### **2. Servicios**
- `Firebase`: Comunicación con Firebase (singleton)
- `Utils`: Funciones reutilizables (toasts, loading, cámara)

### **3. Modelos**
- Interfaces TypeScript para type safety
- Enums para valores constantes

### **4. Componentes**
- Pages: Páginas principales
- Shared: Componentes reutilizables (header, inputs)

---

## 💡 PUNTOS DESTACADOS PARA LA EXPOSICIÓN

### ✅ **Arquitectura Limpia**
- Separación de responsabilidades
- Servicios para lógica de negocio
- Componentes para UI

### ✅ **Seguridad**
- Guards protegen rutas
- Validación de roles
- LocalStorage para sesión

### ✅ **Experiencia de Usuario**
- Loading indicators
- Mensajes de error/éxito
- Confirmaciones antes de eliminar

### ✅ **Tecnologías Modernas**
- Ionic 8 (última versión)
- Angular 20 (última versión)
- Firebase v9 (modular)

---

## 🎤 FRASES CLAVE PARA LA EXPOSICIÓN

1. **"Esta aplicación utiliza una arquitectura modular..."**
   - Módulos lazy loading
   - Servicios inyectados
   - Guards para seguridad

2. **"La autenticación se maneja con Firebase..."**
   - Firebase Authentication para login
   - Firestore para perfiles de usuario
   - LocalStorage para mantener sesión

3. **"Tenemos dos roles principales..."**
   - Admin: gestión completa
   - Padre: solo lectura de materiales

4. **"Los guards protegen las rutas..."**
   - Verifican autenticación
   - Validan roles
   - Redirigen si no autorizado

5. **"Los servicios centralizan la lógica..."**
   - Firebase: operaciones con backend
   - Utils: funciones comunes

---

## 📊 DIAGRAMA DE FLUJO SIMPLE

```
[Usuario] 
    ↓
[Login] → Verifica credenciales → Firebase Auth
    ↓
[Guards] → Valida rol → Permite acceso
    ↓
[Componente] → Llama servicio → Firebase
    ↓
[Firestore] → Guarda/Obtiene datos
    ↓
[UI] → Muestra resultado al usuario
```

---

## 🔍 SI TE PREGUNTAN SOBRE...

### **"¿Cómo se maneja la sesión?"**
→ LocalStorage guarda datos del usuario después del login
→ Guards verifican localStorage en cada ruta
→ Se limpia al cerrar sesión

### **"¿Cómo funcionan los roles?"**
→ Cada usuario tiene un campo `rol: 'admin' | 'padre'`
→ Guards verifican el rol antes de permitir acceso
→ Menús diferentes según rol en app.component

### **"¿Dónde se guardan los datos?"**
→ Firebase Firestore (base de datos NoSQL)
→ Firebase Storage (imágenes)
→ LocalStorage (sesión del usuario)

### **"¿Cómo se protegen las rutas?"**
→ Guards implementan CanActivateFn
→ Verifican localStorage
→ Redirigen a login si no autenticado

### **"¿Cómo se suben las imágenes?"**
→ Capacitor Camera API captura imagen
→ Se convierte a base64
→ Se sube a Firebase Storage
→ Si falla, se guarda como base64 en Firestore

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### **Problema**: "El formulario se limpia al cambiar nivel"
**Solución**: Usar flag `isProgrammatic` para evitar limpiar grado

### **Problema**: "Usuario no se mantiene logueado"
**Solución**: Verificar que se guarde en localStorage después del login

### **Problema**: "No puede acceder a rutas protegidas"
**Solución**: Verificar que guards estén importados en routing modules

---

## 📝 NOTAS ADICIONALES

- **Lazy Loading**: Los módulos se cargan solo cuando se necesitan
- **Reactive Forms**: Validación en tiempo real
- **TypeScript**: Type safety previene errores
- **Firebase v9**: Sintaxis modular más moderna
- **Ionic Components**: UI components listos para móvil

---

## 🎯 CONCLUSIÓN PARA LA EXPOSICIÓN

"Esta aplicación demuestra:
- ✅ Arquitectura escalable y mantenible
- ✅ Seguridad con guards y validaciones
- ✅ Experiencia de usuario fluida
- ✅ Integración moderna con Firebase
- ✅ Código organizado y reutilizable"
