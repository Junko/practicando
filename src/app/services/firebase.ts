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

  //=== Verificar si un correo existe en el sistema ===
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      // Intentar obtener información del usuario por email
      // Firebase no tiene un método directo, pero podemos intentar hacer signIn
      // y capturar el error específico
      const auth = getAuth();
      
      // Intentar enviar email de recuperación
      // Si el correo no existe, Firebase lanzará un error específico
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: any) {
      console.log('Error al verificar correo:', error);
      
      // Códigos de error específicos de Firebase
      if (error.code === 'auth/user-not-found') {
        return false;
      }
      
      // Para otros errores, asumimos que el correo existe
      // (por seguridad, no revelamos si existe o no)
      return true;
    }
  }

  //=== Enviar email para restablecer contraseña ===
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }
}
