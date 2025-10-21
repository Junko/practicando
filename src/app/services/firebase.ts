import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
      // 1. Crear usuario en Firebase Authentication usando AngularFire
      const userCredential = await this.auth.createUserWithEmailAndPassword(userData.correo, userData.contrasena);
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
      await userCredential.user?.updateProfile({
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

  //=== Verificar si el usuario existe ===
  async checkUserExists(email: string) {
    try {
      // Buscar en la colección de usuarios por email
      const db = getFirestore();
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('correo', '==', email));
      const querySnapshot = await getDocs(q);
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      return false;
    }
  }

  //=== Enviar email para restablecer contraseña (con validación) ===
  async sendRecoveryEmail(email: string) {
    try {
      // Verificar si el usuario existe
      const userExists = await this.checkUserExists(email);
      
      if (!userExists) {
        throw new Error('El correo electrónico no está registrado en el sistema');
      }
      
      // Si el usuario existe, enviar el email de recuperación
      return sendPasswordResetEmail(getAuth(), email);
    } catch (error) {
      throw error;
    }
  }
}
