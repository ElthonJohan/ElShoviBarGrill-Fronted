import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    MatButtonModule,
    MatButton
  ],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css']
})
export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient,    private auth: AuthService           // <-- INYECTAR TU SERVICIO
) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.form.invalid) return;

    const credentials = this.form.value;

    // 🔹 Conectar con backend
    this.http.post<any>(`${environment.HOST}/login`, credentials)
      .subscribe({
        next: (res) => {

            console.log('Login response:', res); // ¿incluye fullName/username?

          // Obtener token sin complicar nada
          const token =
            res?.token ??
            res?.accessToken ??
            res?.data?.token ??
            res?.jwt ??
            res?.data?.accessToken;

          if (!token) {
            alert('No se recibió el token del servidor');
            return;
          }

          // 🔹 Guardar en localStorage
          const userToStore = { ...res, token };
          localStorage.setItem('user', JSON.stringify(userToStore));

          // 🔹 Obtener roles desde el token usando tu AuthService
          const roles = this.auth.getUserRoles();
          console.log("Roles obtenidos del token:", roles);

          // 🔹 Redirección según rol
          if (roles.includes('administrador') || roles.includes('mesero')) {
            this.router.navigate(['/admin/dashboard']);
          }
          else if (roles.includes('cliente')) {
            this.router.navigate(['/home']);
          }
          else {
            this.router.navigate(['/home']);
          }
        },

        error: (err) => {
          console.error(err);
          alert('Usuario o contraseña incorrectos');
        }
      });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}