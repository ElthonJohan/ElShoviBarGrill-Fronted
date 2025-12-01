import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatDivider } from "@angular/material/divider";
import { MatPseudoCheckbox, MatPseudoCheckboxModule } from "@angular/material/core";
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
// Si usas el selector de roles:
// import { MatSelectModule } from '@angular/material/select';

export interface Role {
  idRole: number;
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
    HttpClientModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatFormField
],
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  roles: Role[] = [];

  isAdmin = false;
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      // El backend valida tamaño entre 8 y 50 en algunos campos; reflejamos mínimo 8 aquí
      password: ['', [Validators.required, Validators.minLength(8)]],
      // permitimos seleccionar múltiples roles
      roles: [[]],
    });
  }

  ngOnInit(): void {
    // Traer todos los roles desde el backend
    // Intentamos enviar Authorization si el usuario ya está logueado
    const stored = localStorage.getItem('user');
  const parsed = stored ? JSON.parse(stored) : null;
  const token = parsed?.token || parsed?.accessToken || parsed?.data?.token || parsed?.jwt;
  const roles = parsed?.roles || parsed?.authorities || [];

  this.isAdmin = roles.includes('ROLE_ADMINISTRADOR');

  const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  if (this.isAdmin) {
    this.http.get<Role[]>(`${environment.HOST}/roles`, options).subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error('Error al cargar roles', err),
    });
  } else {
    // Asignar automáticamente rol cliente si no es admin
    this.form.patchValue({ roles: [{ idRole: 3 }] }); // Ajusta el ID según tu base de datos
  }
  }

  register(): void {
    if (this.form.invalid) return;

    console.log('FORM VALUE', this.form.value);

    // Transformamos los ids seleccionados en la lista de roles que espera el backend
  const selectedRoleIds: number[] = this.isAdmin
  ? (this.form.value.roles || []).map((v: any) => Number(v))
  : [3]; // ID del rol cliente

    const user = {
      fullName: this.form.value.fullName,
      username: this.form.value.username,
      // some backends expect 'userName' instead of 'username' (send both)
      userName: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
      active: true,
      createdAt: new Date(),
      // many backends expect a list of roles: map selected ids to the Role DTO shape
      roles: selectedRoleIds.map((id) => ({ idRole: id })),
    };

    console.log('user payload', user);

    // Intentar adjuntar Authorization si existe token en localStorage (necesario si el endpoint exige admin)
    let postOptions: any = {};
    try {
      const stored = localStorage.getItem('user');
      const parsed = stored ? JSON.parse(stored) : null;
      const token =
        parsed?.token ||
        parsed?.accessToken ||
        parsed?.data?.token ||
        parsed?.jwt;
      if (token) {
        postOptions = { headers: { Authorization: `Bearer ${token}` } };
        console.log('Enviando Authorization header en POST /users');
      }
    } catch (e) {
      console.warn(
        'No se pudo leer token de localStorage para la petición POST /users',
        e
      );
    }

    this.http
      .post<any>(`${environment.HOST}/users`, user, postOptions)
      .subscribe({
        next: () => {
          alert('Registro exitoso. Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          // Mostrar mensaje claro devuelto por el servidor si existe
          const serverMsg =
            err?.error?.message ||
            err?.error?.error ||
            err?.message ||
            'Error desconocido';
          const details = err?.error?.details
            ? JSON.stringify(err.error.details)
            : '';
          alert(
            `Error en el registro: ${serverMsg}${
              details ? '\nDetalles: ' + details : ''
            }`
          );
        },
      });
  }
}
