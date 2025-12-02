import { Component, NgModule, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';
import { User } from '../../model/user';
import { FormBuilder, FormGroup, FormsModule, NgModel, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit  {
  
  form!: FormGroup;
  userLoaded!: User;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    // 1️⃣ Crear el formulario vacío
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      fullName: [''],
      password: [''], // opcional
    });

    // 2️⃣ Obtener el ID desde el token
    this.userId = this.auth.getUserId()!;

    if (!this.userId) {
      console.error("❌ No se pudo obtener el ID del usuario desde el token.");
      return;
    }

    // 3️⃣ Cargar datos del usuario desde el backend
    this.loadUserData();
  }

  // -------------------------------------------
  // 🔹 CARGAR DATOS DEL USUARIO
  // -------------------------------------------
  loadUserData() {
    this.userService.findById(this.userId).subscribe({
      next: (user: User) => {
        this.userLoaded = user;

        // 4️⃣ Insertar valores en el formulario
        this.form.patchValue({
          email: user.email,
          userName: user.userName,
          fullName: user.fullName,
          password: '' // Nunca revelar contraseñas
        });
      },
      error: (err) => {
        console.error("❌ Error obteniendo usuario:", err);
      }
    });
  }

  // -------------------------------------------
  // 🔹 ACTUALIZAR PERFIL
  // -------------------------------------------
  actualizar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: any = {
      email: this.form.value.email,
      userName: this.form.value.userName,
      fullName: this.form.value.fullName,
    };

    // Contraseña solo si escribió algo
    if (this.form.value.password.trim() !== '') {
      payload.password = this.form.value.password;
    }

    console.log("📤 Enviando payload:", payload);

    this.userService.update(this.userId, payload).subscribe({
      next: () => {
        console.log("✅ Perfil actualizado correctamente");
        alert("Perfil actualizado correctamente");
        this.loadUserData(); // recargar datos
      },
      error: (err) => {
        console.error("❌ Error al actualizar:", err);
        alert("Error al actualizar el perfil");
      }
    });
  }
}