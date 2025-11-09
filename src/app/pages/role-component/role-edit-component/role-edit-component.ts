import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../services/role-service';
import { Role } from '../../../model/role';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-role-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './role-edit-component.html',
  styleUrls: ['./role-edit-component.css']
})
export class RoleEditComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.isEdit = this.id != null;

      if (this.isEdit) {
        this.roleService.findById(this.id).subscribe((data: Role) => {
          this.form.patchValue(data);
        });
      }
    });
  }

  operate(): void {
    const role: Role = this.form.value;

    if (this.isEdit) {
      this.roleService.update(role.id, role).pipe(
        switchMap(() => this.roleService.findAll())
      ).subscribe((data: Role[]) => {
        this.roleService.setRoleChange(data);
        this.roleService.setMessageChange('ROL ACTUALIZADO!');
        this._snackBar.open('ROL ACTUALIZADO!', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/pages/role']);
      });
    } else {
      this.roleService.save(role).pipe(
        switchMap(() => this.roleService.findAll())
      ).subscribe((data: Role[]) => {
        this.roleService.setRoleChange(data);
        this.roleService.setMessageChange('ROL REGISTRADO!');
        this._snackBar.open('ROL REGISTRADO!', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/pages/role']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/pages/role']);
  }
}
