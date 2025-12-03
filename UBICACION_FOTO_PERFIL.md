# 📍 Ubicación de la Foto de Perfil en Firestore

## Ruta Exacta en Firestore

```
Colección: users
Documento: {uid del usuario}
Campo: fotoPerfil
```

### Estructura Completa:

```
📁 Firestore Database
  └── 📁 Colección: users
      └── 📄 Documento: {uid del usuario autenticado}
          ├── uid: string
          ├── nombres: string
          ├── apellidos: string
          ├── correo: string
          ├── telefono: string
          ├── rol: string ('admin' | 'padre')
          ├── creadoEn: Timestamp
          ├── actualizadoEn: Timestamp
          └── fotoPerfil: string (Base64) ⬅️ AQUÍ SE GUARDA LA IMAGEN
```

## Código que lo Implementa

### 1. Función de Actualización (firebase.ts línea 310):
```typescript
await this.updateDocument(`users/${uid}`, updates);
```

### 2. Campo de la Imagen (firebase.ts línea 305):
```typescript
if (datos.fotoPerfil !== undefined) updates.fotoPerfil = datos.fotoPerfil;
```

### 3. Función updateDocument (firebase.ts línea 597-605):
```typescript
async updateDocument(path: string, data: any) {
  try {
    await setDoc(doc(getFirestore(), path), data, { merge: true });
    console.log(`Documento actualizado en ${path}`);
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    throw error;
  }
}
```

## Cómo Localizarlo en Firebase Console

1. **Accede a Firebase Console**: https://console.firebase.google.com/
2. **Selecciona tu proyecto**
3. **Ve a Firestore Database** en el menú lateral
4. **Busca la colección `users`**
5. **Haz clic en el documento con el UID del usuario**
6. **Busca el campo `fotoPerfil`** - ahí estará la imagen en formato Base64

## Ejemplo de UID del Usuario

Para obtener el UID del usuario actualmente autenticado:

```typescript
// En cualquier componente
const user = localStorage.getItem('user');
const userData = JSON.parse(user);
const uid = userData.uid; // Este es el ID del documento
```

La ruta completa sería: `users/${uid}`

## Formato de la Imagen

- **Tipo**: String (Base64)
- **Formato**: `data:image/jpeg;base64,/9j/4AAQSkZJRg...` (muy largo)
- **Tamaño**: Puede ser grande (depende de la calidad de la imagen)

## Nota Importante

⚠️ Las imágenes se guardan **directamente en Firestore** como Base64, no en Firebase Storage. Esto significa:
- ✅ No requiere Storage habilitado
- ✅ Fácil de implementar
- ⚠️ Puede aumentar el tamaño de los documentos
- ⚠️ Firestore tiene límites de tamaño por documento (1MB)

