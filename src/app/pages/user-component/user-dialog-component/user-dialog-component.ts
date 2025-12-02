import { Component, Inject } from '@angular/core';
import { User } from '../../../model/user';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../services/user-service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { catchError, map, of, switchMap } from 'rxjs';
import { Role } from '../../../model/role';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-dialog-component',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-dialog-component.html',
  styleUrl: './user-dialog-component.css',
})
export class UserDialogComponent {
 
  form!: FormGroup;
  user!: User;
  roles: Role[] = [];
  isEdit = false;

  statuses = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: User | null,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    // 👇 EDIT si viene un usuario con idUser > 0
    this.isEdit = !!(this.data && this.data.idUser && this.data.idUser > 0);

    // 👇 Usuario base (para crear o editar)
    this.user = this.isEdit
      ? this.data as User
      : {
          idUser: 0,
          email: '',
          userName: '',
          password: '',
          fullName: '',
          active: true,
          createdAt: new Date(),
          roles: []
        };

    // 👇 Construcción del formulario
    this.form = this.fb.group({
      email: [
        this.user.email,
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.userEmailUniqueValidator()],
          updateOn: 'blur'
        }
      ],
      userName: [this.user.userName, Validators.required],
      fullName: [this.user.fullName],
      // contraseña requerida solo en CREAR
      password: ['', this.isEdit ? [] : [Validators.required]],
      active: [this.user.active, Validators.required],
      roles: [
        this.user.roles?.map(r => r.idRole) ?? [],
        Validators.required
      ]
    });

    // Cargar lista de roles desde backend
    this.userService.getRoles().subscribe(roles => (this.roles = roles));
  }

  /** Validador asíncrono para email único (ignora el usuario actual en edición) */
  userEmailUniqueValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) {
        return of(null);
      }

      return this.userService.findAll().pipe(
        map((users: User[]) => {
          const exists = users.some(
            u => u.email === value && u.idUser !== this.user?.idUser
          );
          return exists ? { userEmailExists: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  close(): void {
    this.dialogRef.close();
  }

  handleError(err: any) {
    const message = err?.error || 'Error inesperado';
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      panelClass: ['snackbar-error']
    });
  }

  operate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formVal = this.form.getRawValue();

    const payload: User = {
      ...this.data,
      
      email: formVal.email,
      userName: formVal.userName,
      fullName: formVal.fullName,
      active: formVal.active,
      // nunca enviamos contraseña encriptada desde frontend
      password: formVal.password,
      createdAt: this.user.createdAt,
      roles: formVal.roles.map((id: number) => ({ idRole: id }))
    };

    console.log('Payload enviado:', payload);

    const request$ = this.isEdit
      ? this.userService.update(payload.idUser, payload)
      : this.userService.save(payload);

    request$
      .pipe(switchMap(() => this.userService.findAll()))
      .subscribe({
        next: (data) => {
          this.userService.setModelChange(data);
          this.userService.setMessageChange(
            this.isEdit ? 'USUARIO ACTUALIZADO' : 'USUARIO CREADO'
          );
          this.dialogRef.close(payload);
        },
        error: (err) => this.handleError(err)
      });
  }
}