import { Component, ViewChild } from '@angular/core';
import { CategoryService, Category } from '../../services/category-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { switchMap } from 'rxjs';

@Component({
  selector: 'app-category',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './category-component.html',
  styleUrl: './category-component.css',
})
export class CategoryComponent {
  dataSource!: MatTableDataSource<Category>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columnsDefinitions = [
    { def: 'idCategory', label: 'ID', hide: true },
    { def: 'name', label: 'Nombre', hide: false },
    { def: 'description', label: 'Descripción', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  constructor(
    private categoryService: CategoryService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categoryService.findAll().subscribe((data) => this.createTable(data));
    this.categoryService.getCategoryChange().subscribe((data) => this.createTable(data));
    this.categoryService.getMessageChange().subscribe((msg) =>
      this._snackBar.open(msg, 'INFO', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      })
    );
  }

  createTable(data: Category[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    this.categoryService
      .delete(id)
      .pipe(switchMap(() => this.categoryService.findAll()))
      .subscribe((data) => {
        this.categoryService.setCategoryChange(data);
        this.categoryService.setMessageChange('CATEGORÍA ELIMINADA!');
      });
  }
}
