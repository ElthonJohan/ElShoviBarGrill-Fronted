import { Component, Inject } from '@angular/core';
import { Role } from '../../../model/role';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RoleService } from '../../../services/role-service';
import { catchError, map, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-role-dialog-component',
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
  templateUrl: './role-dialog-component.html',
  styleUrl: './role-dialog-component.css',
})
export class RoleDialogComponent {
  role: Role;
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Role,
    private _dialogRef: MatDialogRef<RoleDialogComponent>,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.role = { ...this.data };
    this.form = this.fb.group({
      name: this.fb.control(this.role.name ?? '', {
        validators: [Validators.required],
        asyncValidators: [this.rolNameUniqueValidator()],
        updateOn: 'blur',
      }),
      description: this.fb.control(this.role.description ?? '')
    });
    //this.medic = this.data;
    /*this.medic = new Medic();
    this.medic.idMedic = this.data.idMedic;
    this.medic.idSpecialty = this.data.idSpecialty;
    this.medic.primaryName = this.data.primaryName;
    this.medic.surname = this.data.surname;
    this.medic.photo = this.data.photo;*/
  }

  /** Async validator: checks backend for existing tableNumber and ignores current table id */
  rolNameUniqueValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value == null || value === '') {
        return of(null);
      }
      return this.roleService.findAll().pipe(
        map((roles: Role[]) => {
          const exists = roles.some(t => t.name == value && t.idRole !== this.role?.idRole);
          return exists ? { roleNameExists: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  close() {
    this._dialogRef.close();
  }

  operate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // merge form values into table object
    const formVal = this.form.value;
    const payload: Role = {
      ...this.role,
      name: formVal.name,
      description: formVal.description,
    };

    if (payload != null && payload.idRole > 0) {
      // UPDATE
      this.roleService
        .update(payload.idRole, payload)
        .pipe(switchMap(() => this.roleService.findAll()))
        .subscribe((data) => {
          this.roleService.setModelChange(data);
          this.roleService.setMessageChange('UPDATED!');
        });
    } else {
      // INSERT
      this.roleService
        .save(payload)
        .pipe(switchMap(() => this.roleService.findAll()))
        .subscribe((data) => {
          this.roleService.setModelChange(data);
          this.roleService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }
}
