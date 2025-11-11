import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, getDoc, query, where, CollectionReference, Query, deleteDoc, updateDoc,onSnapshot } from 'firebase/firestore';
import { User, CrearUsuario } from '../models/user.model';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Firebase {
  // auth = inject(AngularFireAuth);
  private db = getFirestore();
  // constructor(private firestore: Firestore){}
   private auth = getAuth();
  

  //=== FIRESTORE ===
  
  //== Guardar Documento ==
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //== Obtener Documento ==
  async getDocument(path: string) {
    const snap = await getDoc(doc(getFirestore(), path));
    return snap.exists() ? snap.data() : null;
  }

  //=== AUTENTICACION ===

  getAuth() {
    return getAuth();
  }

  //== Acceder ==
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.correo, user.contrasena);
  }

  //== Crear Usuario ==
  signUp(user: CrearUsuario) {
    return createUserWithEmailAndPassword(getAuth(), user.correo, user.contrasena);
  }

  //== Crear Usuario Completo (Authentication + Firestore) ==
  async createUserComplete(userData: CrearUsuario) {
    try {
      // 1. Crear usuario en Firebase Authentication usando Firebase v9 (no afecta sesión actual)
      const userCredential = await createUserWithEmailAndPassword(getAuth(), userData.correo, userData.contrasena);
      const uid = userCredential.user?.uid;

      if (!uid) {
        throw new Error('No se pudo obtener el UID del usuario');
      }

      // 2. Crear perfil de usuario para Firestore
      const userProfile = {
        uid: uid,
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        correo: userData.correo,
        telefono: userData.telefono,
        rol: userData.rol,
        creadoEn: new Date()
      };

      // 3. Guardar en Firestore usando la función setDocument
      await this.setDocument(`users/${uid}`, userProfile);

      // 4. Actualizar el displayName en Authentication
      await updateProfile(userCredential.user, {
        displayName: `${userData.nombres} ${userData.apellidos}`
      });

      console.log('Usuario creado exitosamente en Authentication y Firestore:', userProfile);

      return {
        success: true,
        user: userCredential.user,
        profile: userProfile
      };

    } catch (error) {
      console.error('Error al crear usuario completo:', error);
      throw error;
    }
  }

  //== Guardar Datos Temporales de Usuario Padre (Sin Authentication) ==
  async guardarDatosTemporalesPadre(userData: CrearUsuario) {
    try {
      // Solo guardar datos temporales en localStorage 
      const tempUserData = {
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        correo: userData.correo,
        contrasena: userData.contrasena, // Necesario para crear en Authentication después
        telefono: userData.telefono,
        rol: userData.rol,
        creadoEn: new Date(),
        timestamp: Date.now() // Para verificar que los datos no sean muy antiguos
      };

      // Limpiar cualquier dato temporal anterior
      localStorage.removeItem('tempUserData');
      localStorage.setItem('tempUserData', JSON.stringify(tempUserData));

      console.log('Datos temporales de usuario padre guardados:', tempUserData);

      return {
        success: true,
        tempData: tempUserData
      };

    } catch (error) {
      console.error('Error al guardar datos temporales:', error);
      // Limpiar datos temporales en caso de error
      localStorage.removeItem('tempUserData');
      throw error;
    }
  }

  //== Completar Registro de Usuario Padre (Authentication + Firestore + Estudiantes) ==
  async completarRegistroPadre(hijos: any[]) {
    try {
      const tempUserDataStr = localStorage.getItem('tempUserData');
      
      if (!tempUserDataStr) {
        throw new Error('No se encontraron datos temporales del usuario. Por favor, inicie el proceso de registro nuevamente.');
      }

      const tempUserData = JSON.parse(tempUserDataStr);
      
      // Verificar que los datos temporales sean válidos y no muy antiguos
      if (!tempUserData.timestamp) {
        throw new Error('Datos temporales inválidos. Por favor, inicie el proceso de registro nuevamente.');
      }

      const now = Date.now();
      const maxAge = 60 * 60 * 1000; 
      if (now - tempUserData.timestamp > maxAge) {
        localStorage.removeItem('tempUserData');
        throw new Error('Los datos temporales han expirado. Por favor, inicie el proceso de registro nuevamente.');
      }

      // 1. Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(getAuth(), tempUserData.correo, tempUserData.contrasena);
      const uid = userCredential.user?.uid;

      if (!uid) {
        throw new Error('No se pudo obtener el UID del usuario');
      }

      // 2. Actualizar el displayName en Authentication
      await updateProfile(userCredential.user, {
        displayName: `${tempUserData.nombres} ${tempUserData.apellidos}`
      });

      // 3. Crear perfil del usuario padre en Firestore
      const userProfile = {
        uid: uid,
        nombres: tempUserData.nombres,
        apellidos: tempUserData.apellidos,
        correo: tempUserData.correo,
        telefono: tempUserData.telefono,
        rol: tempUserData.rol,
        creadoEn: tempUserData.creadoEn,
        registroCompleto: true,
        completadoEn: new Date()
      };

      await this.setDocument(`users/${uid}`, userProfile);

      // 4. Crear estudiantes en colección separada
      const estudiantesCreados = [];
      for (const hijo of hijos) {
        const estudianteData = {
          nombre: hijo.nombre,
          apellido: hijo.apellido,
          nivel: hijo.nivel,
          grado: hijo.grado,
          seccion: hijo.seccion,
          padreUid: uid, // Referencia al padre
          creadoEn: new Date()
        };

        // Generar un ID único para el estudiante
        const estudianteId = `${uid}_${hijo.nombre}_${hijo.apellido}_${Date.now()}`;
        await this.setDocument(`estudiantes/${estudianteId}`, estudianteData);
        estudiantesCreados.push({ id: estudianteId, ...estudianteData });
      }

      // 5. Limpiar datos temporales
      localStorage.removeItem('tempUserData');

      console.log('Registro de usuario padre completado:', userProfile);
      console.log('Estudiantes creados:', estudiantesCreados);

      return {
        success: true,
        user: userCredential.user,
        profile: userProfile,
        estudiantes: estudiantesCreados
      };

    } catch (error) {
      console.error('Error al completar registro de usuario padre:', error);
      // Limpiar datos temporales en caso de error
      localStorage.removeItem('tempUserData');
      throw error;
    }
  }

  //== Verificar si hay datos temporales pendientes ==
  getTempUserData() {
    const tempUserDataStr = localStorage.getItem('tempUserData');
    if (!tempUserDataStr) return null;

    try {
      const tempUserData = JSON.parse(tempUserDataStr);
      
      // Verificar que los datos no sean muy antiguos
      const now = Date.now();
      const maxAge = 60 * 60 * 1000; // 1 hora
      if (now - tempUserData.timestamp > maxAge) {
        localStorage.removeItem('tempUserData');
        return null;
      }

      return tempUserData;
    } catch (error) {
      localStorage.removeItem('tempUserData');
      return null;
    }
  }

  //== Actualizar Usuario ==
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  //=== Enviar email para restablecer contraseña ===
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //=== Cerrar sesión ===
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('session');
    // Nota: No podemos usar this.utilsSvc aquí porque no está inyectado
    // La redirección se manejará en el componente
    return this.auth.signOut();
  }
// función genérica para leer una colección una sola vez
  async getCollectionOnce(nombreColeccion: string){
    const ref = collection(this.db, nombreColeccion);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc=>({id: doc.id, ...doc.data()}));
  }

  //=== Agregar documento con auto-generación de ID ===
  async addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  //=== Eliminar documento por ruta ===
  async deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  //=== Eliminar usuario completo (Firestore + Authentication) ===
  async deleteUserComplete(userId: string) {
    try {
      // 1. Obtener el usuario actual para verificar permisos
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      // 2. Eliminar documento de Firestore
      await this.deleteDocument(`users/${userId}`);

      // 3. Eliminar también estudiantes asociados si es un padre
      const estudiantes = await this.getEstudiantesByPadreUid(userId);
      for (const estudiante of estudiantes) {
        await this.deleteDocument(`estudiantes/${estudiante.id}`);
      }

      console.log('Usuario eliminado completamente de Firestore y estudiantes asociados');
      
      return {
        success: true,
        message: 'Usuario eliminado correctamente'
      };

    } catch (error) {
      console.error('Error al eliminar usuario completo:', error);
      throw error;
    }
  }

  //=== Subir imagen a Firebase Storage ===
  async uploadImage(path: string, data_url: string) {
    try {
      await uploadString(ref(getStorage(), path), data_url, 'data_url');
      const downloadURL = await getDownloadURL(ref(getStorage(), path));
      return downloadURL;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  }

  //=== Obtener fullPath en Storage para una URL de descarga ===
  getFirePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  //=== Obtener listas de útiles por nivel ===
  async getListasUtilesByNivel(nivel: string) {
    const q = query(
      collection(getFirestore(), 'listas_utiles'),
      where('nivel', '==', nivel)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  //=== Obtener lista de útiles por ID ===
  async getListaUtilesById(listaId: string) {
    return await this.getDocument(`listas_utiles/${listaId}`);
  }

  //=== Guardar lista de útiles completa ===
  async guardarListaUtiles(data: any) {
    try {
      // Guardar la lista principal
      const docRef = await this.addDocument('listas_utiles', {
        nivel: data.nivel,
        grado: data.grado,
        anio: data.anio,
        materiales: data.materiales || [],
        creadoEn: new Date(),
        actualizadoEn: new Date()
      });
      
      console.log('Lista guardada con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar lista de útiles:', error);
      throw error;
    }
  }

  //=== Obtener todas las listas de útiles (para admin) ===
  async getAllListasUtiles() {
    try {
      const ref = collection(getFirestore(), 'listas_utiles');
      const snapshot = await getDocs(ref);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener listas de útiles:', error);
      throw error;
    }
  }

  //=== Obtener lista de útiles por grado y nivel (para padres) ===
  async getListaByGradoYNivel(grado: string, nivel: string) {
    try {
      const q = query(
        collection(getFirestore(), 'listas_utiles'),
        where('grado', '==', grado),
        where('nivel', '==', nivel)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener lista por grado y nivel:', error);
      throw error;
    }
  }

  //=== Obtener estudiantes de un padre ===
  async getEstudiantesByPadreUid(padreUid: string) {
    try {
      console.log('Buscando estudiantes con padreUid:', padreUid);
      
      const q = query(
        collection(getFirestore(), 'estudiantes'),
        where('padreUid', '==', padreUid)
      );
      
      console.log('Query creada, obteniendo documentos...');
      const snapshot = await getDocs(q);
      
      console.log('Total documentos encontrados:', snapshot.size);
      
      const estudiantes = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Estudiante encontrado:', { id: doc.id, data });
        return { id: doc.id, ...data };
      });
      
      return estudiantes;
    } catch (error) {
      console.error('Error al obtener estudiantes del padre:', error);
      throw error;
    }
  }

  //=== Obtener todos los usuarios (para admin) ===
  async getAllUsers() {
    try {
      const ref = collection(getFirestore(), 'users');
      const snapshot = await getDocs(ref);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }


//=== Obtener muebles de un aula específico por grado y nivel ===
async getMueblesByGradoYNivel(grado: string, nivel: string, seccion:string) {
  try {
       const normalize = (str: string) =>
      str
        ?.replace(/º/g, 'º') // reemplaza el símbolo ordinal por el de grado
        ?.trim();
    const q = query(
      collection(getFirestore(), 'aulas'),
      where('grado', '==', normalize(grado)),
      where('nivel', '==', normalize(nivel)),
      where('seccion', '==', normalize(seccion))    
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const data: any = docSnap.data();
      return { id: docSnap.id, ...data }; 
    }

    // si no se encuentra ningún aula que coincida
    return null;

  } catch (error) {
    console.error('Error al obtener muebles por grado y nivel:', error);
    throw error;
  }
}

async getCollection(nombre: string): Promise<any[]> {
  const snapshot = await getDocs(collection(this.db, nombre));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async updateDocument(path: string, data: any) {
  try {
    await setDoc(doc(getFirestore(), path), data, { merge: true });
    console.log(`Documento actualizado en ${path}`);
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    throw error;
  }
}

listenCollection(nombreColeccion: string, callback: (data: any[]) => void) {
    const ref = collection(this.db, nombreColeccion);
    
    return onSnapshot(ref, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  }


}
