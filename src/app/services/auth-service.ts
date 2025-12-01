import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string | null {
    const raw = localStorage.getItem('user');
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.token ?? parsed?.accessToken ?? parsed?.data?.token ?? parsed?.jwt ?? null;
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return 'INVITADO';

    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || 'INVITADO';
    } catch (e) {
      console.error('Error decoding token', e);
      return 'INVITADO';
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
