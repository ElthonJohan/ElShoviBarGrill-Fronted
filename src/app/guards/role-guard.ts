import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'] || [];
  const userRoles = this.auth.getUserRoles(); // ahora devuelve array


  console.log('User roles:', userRoles, 'Expected:', expectedRoles);

  // Permitir acceso si no se requiere rol
  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  // Permitir acceso si al menos un rol coincide
  if (userRoles.some(r => expectedRoles.includes(r))) {
    return true;
  }

  // Permitir acceso a /home si es invitado
  if (route.routeConfig?.path === 'home' && userRoles.includes('INVITADO')) {
    return true;
  }

  this.router.navigate(['/home']);
  return false;
}
}
