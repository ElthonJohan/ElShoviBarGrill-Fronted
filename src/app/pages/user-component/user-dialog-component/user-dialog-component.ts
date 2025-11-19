import { Component, Inject } from '@angular/core';
import { User } from '../../../model/user';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user-service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { catchError, map, of, switchMap } from 'rxjs';
import { Role } from '../../../model/role';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerToggle, MatDatepickerInput } from "@angular/material/datepicker";

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
    MatButtonModule,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput
],
  templateUrl: './user-dialog-component.html',
  styleUrl: './user-dialog-component.css',
})
export class UserDialogComponent {
   user: User;
  form!: FormGroup;
  roles:Role[] = []; 
  statuses = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: User,
    private _dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.user = { ...this.data };
    this.form = this.fb.group({
      email: this.fb.control(this.user.email ?? '', {
        validators: [Validators.required],
        asyncValidators: [this.userEmailUniqueValidator()],
        updateOn: 'blur'
      }),
      userName: this.fb.control(this.user.userName ?? '', [Validators.required]),
      password: this.fb.control(this.user.password ?? '', [Validators.required]),
      fullName: this.fb.control(this.user.fullName ?? '', ),
      createdAt: this.fb.control(this.user.createdAt ?? '', ),
      active: this.fb.control(this.user.active ?? '', [Validators.required]),
      roles: this.fb.control(this.user.roles ?? '', [Validators.required])
    });
    //this.medic = this.data;
    /*this.medic = new Medic();
    this.medic.idMedic = this.data.idMedic;
    this.medic.idSpecialty = this.data.idSpecialty;
    this.medic.primaryName = this.data.primaryName;
    this.medic.surname = this.data.surname;
    this.medic.photo = this.data.photo;*/

    this.userService.getRoles().subscribe(roles => this.roles = roles);

  }

  /** Async validator: checks backend for existing email and ignores current user id */
  userEmailUniqueValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value == null || value === '') {
        return of(null);
      }
      return this.userService.findAll().pipe(
        map((users: User[]) => {
          const exists = users.some(t => t.email == value && t.idUser !== this.user?.idUser);
          return exists ? { userEmailExists: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  close(){
    this._dialogRef.close();
  }

  operate(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // merge form values into user object
    const formVal = this.form.value;
    const payload: User = {
      ...this.user,
      email: formVal.email,
      userName: formVal.userName,
      active: formVal.active,
      password: formVal.password,
      fullName: formVal.fullName,
      createdAt: formVal.createdAt,
      roles: formVal.roles
    };

    if (payload != null && payload.idUser > 0 ) {
      // UPDATE
      this.userService.update(payload.idUser, payload)
        .pipe(switchMap(() => this.userService.findAll()))
        .subscribe(data => {
          this.userService.setModelChange(data);
          this.userService.setMessageChange('UPDATED!');
        });
    } else {
      // INSERT
      this.userService.save(payload)
        .pipe(switchMap(() => this.userService.findAll()))
        .subscribe(data => {
          this.userService.setModelChange(data);
          this.userService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }
}
