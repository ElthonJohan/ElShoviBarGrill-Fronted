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
  if (!token) return ['invitado'];

  try {
    const decoded: any = jwtDecode(token);

    let roles: string[] = [];

    // si backend manda array
    if (Array.isArray(decoded.roles)) {
      roles = decoded.roles;
    }

    // si backend manda string
    if (typeof decoded.roles === 'string') {
      roles = decoded.roles.split(',');
    }

    // normalizar
    roles = roles.map(r =>
      r.toLowerCase()
        .replace(/^role_/, '')            // ROLE_ADMIN → admin
        .replace('administrador', 'admin') // tu backend → admin
        .trim()
    );

    return roles;
  } catch (e) {
    return ['invitado'];
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

  hasRole(role: string): boolean {
  const roles = this.getUserRoles();
  return roles.includes(role.toLowerCase());
}

getUserId(): number | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.id || decoded.idUser || null;
  } catch (e) {
    return null;
  }
}



}
