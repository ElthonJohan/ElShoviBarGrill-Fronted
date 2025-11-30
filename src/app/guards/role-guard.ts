import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'];
    const userRole = this.auth.getUserRole(); // tu método para obtener el rol actual

     // Permitir acceso si no se requiere rol
  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  // Permitir acceso si el rol coincide
  if (expectedRoles.includes(userRole)) {
    return true;
  }

  // Permitir acceso a /home si no hay rol
  if (route.routeConfig?.path === 'home' && userRole === 'INVITADO') {
    return true;
  }

  this.router.navigate(['/home']);
  return false;}
}
