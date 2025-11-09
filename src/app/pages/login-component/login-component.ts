import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
    HttpClientModule
  ],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css']
})
export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.form.invalid) return;

    const credentials = this.form.value;

    // 🔹 Conectar con backend
    this.http.post<any>(`${environment.HOST}/auth/login`, credentials)
      .subscribe({
        next: (res) => {
          // Guardamos usuario en localStorage
          localStorage.setItem('user', JSON.stringify(res));
          this.router.navigate(['/pages/dashboard']); // Redirigir al dashboard
        },
        error: (err) => {
          alert('Usuario o contraseña incorrectos');
        }
      });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
