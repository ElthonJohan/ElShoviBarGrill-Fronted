import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role-service';
import { Role } from '../../model/role';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './role-component.html',
  styleUrls: ['./role-component.css']
})
export class RoleComponent implements OnInit {
  roles: Role[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  constructor(
    private roleService: RoleService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    // Suscribirse a cambios de roles
    this.roleService.getRoleChange().subscribe(data => this.roles = data);
  }

  loadRoles(): void {
    this.roleService.findAll().subscribe(data => this.roles = data);
  }

  editRole(role: Role): void {
    this.router.navigate(['/pages/role/edit', role.idRole]);
  }

  deleteRole(role: Role): void {
    if (confirm(`¿Desea eliminar el rol "${role.name}"?`)) {
      this.roleService.delete(role.idRole).subscribe(() => {
        this._snackBar.open('ROL ELIMINADO!', 'Cerrar', { duration: 2000 });
        this.loadRoles();
      });
    }
  }

  newRole(): void {
    this.router.navigate(['/pages/role/edit']);
  }
}
