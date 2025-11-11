import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      const raw = localStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : null;
      const token = parsed?.token ?? parsed?.accessToken ?? parsed?.data?.token ?? parsed?.jwt;

      if (token) {
        const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        return next.handle(authReq);
      }
    } catch (e) {
      // ignore JSON parse errors
      console.error('AuthInterceptor parse error', e);
    }
    return next.handle(req);
  }
}
