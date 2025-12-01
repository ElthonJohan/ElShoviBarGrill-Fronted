import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
   getToken(): string | null {
    const raw = localStorage.getItem('user');
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.token ?? parsed?.accessToken ?? parsed?.data?.token ?? parsed?.jwt ?? null;
  }

 getUserRoles(): string[] {
  const token = this.getToken();
  if (!token) return ['INVITADO'];

  try {
    const decoded: any = jwtDecode(token);

    let roles: string[] = [];

    // Caso 1: el backend devuelve un array
    if (Array.isArray(decoded.roles)) {
      roles = decoded.roles;
    }
    // Caso 2: el backend devuelve un string con comas
    else if (typeof decoded.role === 'string') {
      roles = decoded.role.split(','); // separar por coma
    }
    else if (decoded.role) {
      roles = [decoded.role];
    }

    // Normalizar: quitar prefijo "ROL_" o "role_" y pasar a minúsculas
    return roles.map(r =>
      r.replace(/^ROL_/i, '')
       .replace(/^role_/i, '')
       .toLowerCase()
       .trim()
    );
  } catch (e) {
    console.error('Error decoding token', e);
    return ['INVITADO'];
  }
  
  }
   getUserName(): string {
    const raw = localStorage.getItem('user');
    if (!raw) return 'INVITADO';

    const user = JSON.parse(raw);
    const token = user.token;

    if (!token) return 'INVITADO';

    try {
      const decoded: any = jwtDecode(token);
      // Usamos el campo "sub" como nombre visible
      return decoded.sub || 'Usuario';
    } catch {
      return 'Usuario';
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
