import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Role {
  id: number;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    HttpClientModule
  ],
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  roles: Role[] = [];

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: this.fb.group({
        id: [1, Validators.required] // Cliente por defecto
      })
    });
  }

  ngOnInit(): void {
    // Traer todos los roles desde el backend
    this.http.get<Role[]>(`${environment.HOST}/roles`).subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('Error al cargar roles', err)
    });
  }

  register(): void {
  if (this.form.invalid) return;

  // Transformamos roleId en role para enviar al backend
  const user = {
    fullName: this.form.value.fullName,
    username: this.form.value.username,
    email: this.form.value.email,
    password: this.form.value.password,
    active: true,
    createdAt: new Date(),
    role: {
      id: this.form.value.roleId
    }
  };

  this.http.post<any>(`${environment.HOST}/users/register`, user)
    .subscribe({
      next: () => {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        alert('Error en el registro. Verifica los datos.');
      }
    });
}

}
