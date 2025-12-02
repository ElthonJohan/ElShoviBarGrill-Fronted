import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRoles: string[] = (route.data['roles'] || []).map(r => r.toLowerCase());
    const userRoles = this.auth.getUserRoles(); // ['admin', 'mesero', ...] siempre minúsculas

    console.log('User roles:', userRoles, 'Expected:', expectedRoles);

    // Si la ruta no requiere roles → permitir acceso
    if (expectedRoles.length === 0) {
      return true;
    }

    // Verificar si al menos un rol coincide
    const hasAccess = userRoles.some(role => expectedRoles.includes(role));

    if (!hasAccess) {
        console.warn('Acceso denegado. Roles del usuario:', userRoles, 'Requeridos:', expectedRoles);

  this.router.navigate(['/access-denied']);
  return false;
}
  return true;


  }
}