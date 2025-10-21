import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { User, CrearUsuario } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class Firebase {
  auth = inject(AngularFireAuth);

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
}
