import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../model/user';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { UserService } from '../../services/user-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDialogComponent } from './user-dialog-component/user-dialog-component';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
],
  templateUrl: './user-component.html',
  styleUrl: './user-component.css',
})
export class UserComponent {
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

  columnsDefinitions = [
    { def: 'idUser', label: 'idUser', hide: true },
    { def: 'email', label: 'email', hide: false },
    { def: 'userName', label: 'userName', hide: false },
    { def: 'password', label: 'password', hide: true },
    { def: 'fullName', label: 'fullName', hide: false },
    { def: 'createdAt', label: 'createdAt', hide: false },
    { def: 'active', label: 'active', hide: false },
    { def: 'roles', label: 'roles', hide: false },

    { def: 'actions', label: 'actions', hide: false }

  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userService.findAll().subscribe((data) => this.createTable(data));
    this.userService.getModelChange().subscribe(data => this.createTable(data));
    this.userService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 2000 }));
  }

  createTable(data: User[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  openDialog(user?: User) {
    if (user?.idUser) {
    // Editar
    this.userService.findById(user.idUser).subscribe(fullUser => {
      this._dialog.open(UserDialogComponent, {
        width: '707px',
        maxWidth: '95vw',
        autoFocus: false,
        disableClose: true,
        data: fullUser
      });
    });
  } else {
    // Crear
    this._dialog.open(UserDialogComponent, {
      width: '707px',
      maxWidth: '95vw',
      autoFocus: false,
      disableClose: true,
      data: null   // 👈 IMPORTANTE: null, no {}
    });
  }
}

  applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim();
  }
  // getRolesString(user: User): string {
  //   return user.roles.map(r => r.name).join(', ');
  // }


  delete(id: number) {
    this.userService
      .delete(id)
      .pipe(switchMap(() => this.userService.findAll()))
      .subscribe((data) => {
        this.userService.setModelChange(data);
        this.userService.setMessageChange('RESERVACIÓN ELIMINADO!');
      });
  }

}
