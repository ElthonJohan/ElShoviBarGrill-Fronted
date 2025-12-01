import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Rutas públicas que NO deben llevar token
    const publicUrls = ['/login', '/register'];

    if (publicUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    try {
      const raw = localStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : null;

      const token =
        parsed?.token ??
        parsed?.accessToken ??
        parsed?.data?.token ??
        parsed?.jwt ??
        null;

      // No enviar token inválido
      if (token && token !== 'null' && token !== 'undefined') {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next.handle(authReq);
      }

    } catch (e) {
      console.error('AuthInterceptor parse error', e);
    }
    return next.handle(req);
  }
}
