import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
   getToken(): string | null {
    const raw = localStorage.getItem('user');
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.token ?? parsed?.accessToken ?? parsed?.data?.token ?? parsed?.jwt ?? null;
  }

  // ========================
  //     ROLES DEL USUARIO
  // ========================
  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return ['invitado'];

    try {
      const decoded: any = jwtDecode(token);

      let roles: string[] = [];

      // BACKEND envía array → ["administrador","mesero"]
      if (Array.isArray(decoded.roles)) {
        roles = decoded.roles;
      }

      // Si por alguna razón viniera como string → "cliente,mesero"
      else if (typeof decoded.roles === 'string') {
        roles = decoded.roles.split(',');
      }

      // Normalizar siempre como minúsculas
      return roles.map(r => r.trim().toLowerCase());

    } catch (e) {
      console.error("Error decoding roles:", e);
      return ['invitado'];
    }
  }

  // ========================
  //    Obtener Nombre
  // ========================
  getUserName(): string {
    const token = this.getToken();
    if (!token) return 'INVITADO';

    try {
      const decoded: any = jwtDecode(token);
      return decoded.userName || decoded.sub || 'Usuario';
    } catch {
      return 'Usuario';
    }
  }

  // ========================
  //    LOGIN VALIDATION
  // ========================
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role.toLowerCase());
  }

  // ========================
  //      Obtener ID User
  // ========================
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);

      return decoded.idUser || decoded.id || null;
    } catch (error) {
      console.error("Error obteniendo ID:", error);
      return null;
    }
  }

}
