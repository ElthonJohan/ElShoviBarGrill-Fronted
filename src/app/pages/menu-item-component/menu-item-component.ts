import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MenuItem } from '../../model/menuitem';
import { Role } from '../../model/role';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MenuItemService } from '../../services/menu-item-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuItemDialogComponent } from './menu-item-dialog-component/menu-item-dialog-component';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'app-menu-item-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule    
],
  templateUrl: './menu-item-component.html',
  styleUrl: './menu-item-component.css',
})
export class MenuItemComponent {
   dataSource: MatTableDataSource<MenuItem> = new MatTableDataSource<MenuItem>();

  columnsDefinitions = [
    { def: 'idMenuItem', label: 'idMenuItem', hide: true },
    { def: 'imageUrl', label: 'imageUrl', hide: false },
    { def: 'name', label: 'name', hide: false },
    { def: 'description', label: 'description', hide: false },
    { def: 'price', label: 'price', hide: false },
    { def: 'available', label: 'available', hide: false },
    { def: 'idCategory', label: 'idCategory', hide: false },
    { def: 'actions', label: 'actions', hide: false }

  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private menuItemService: MenuItemService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.menuItemService.findAll().subscribe((data) => this.createTable(data));
    this.menuItemService.getModelChange().subscribe(data => this.createTable(data));
    this.menuItemService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 2000 }));
  }

  createTable(data: MenuItem[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  openDialog(table?: MenuItem) {
    this._dialog.open(MenuItemDialogComponent, {
      width: '750px',
      data: table
    });
  }

  applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number) {
    this.menuItemService
      .delete(id)
      .pipe(switchMap(() => this.menuItemService.findAll()))
      .subscribe((data) => {
        this.menuItemService.setModelChange(data);
        this.menuItemService.setMessageChange('MENU-ITEM ELIMINADO!');
      });
  }
}
