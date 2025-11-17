import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleService } from '../../services/role-service';
import { Role } from '../../model/role';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { RoleDialogComponent } from './role-dialog-component/role-dialog-component';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './role-component.html',
  styleUrls: ['./role-component.css']
})
export class RoleComponent implements OnInit {
  dataSource: MatTableDataSource<Role> = new MatTableDataSource<Role>();

  columnsDefinitions = [
    { def: 'idRole', label: 'idRole', hide: true },
    { def: 'name', label: 'name', hide: false },
    { def: 'description', label: 'description', hide: false },
    { def: 'actions', label: 'actions', hide: false }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private roleService: RoleService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.roleService.findAll().subscribe((data) => this.createTable(data));
    this.roleService.getModelChange().subscribe(data => this.createTable(data));
    this.roleService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 2000 }));
  }

  createTable(data: Role[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  openDialog(table?: Role) {
    this._dialog.open(RoleDialogComponent, {
      width: '750px',
      data: table
    });
  }

  applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number) {
    this.roleService
      .delete(id)
      .pipe(switchMap(() => this.roleService.findAll()))
      .subscribe((data) => {
        this.roleService.setModelChange(data);
        this.roleService.setMessageChange('CATEGORÍA ELIMINADA!');
      });
  }
}
