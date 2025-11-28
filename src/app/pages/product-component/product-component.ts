import { Component, ViewChild } from '@angular/core';
import { MenuItem } from '../../model/menuitem';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MenuItemService } from '../../services/menu-item-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { ProductDialogComponent } from './product-dialog-component/product-dialog-component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { Category } from '../../model/category';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-product-component',
  imports: [
     MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    CommonModule
  ],
  templateUrl: './product-component.html',
  styleUrl: './product-component.css',
})
export class ProductComponent {
  items:MenuItem[]=[];

  category:Category;
  dataSource: MatTableDataSource<MenuItem> = new MatTableDataSource<MenuItem>();

  columnsDefinitions = [
    { def: 'idMenuItem', label: 'idMenuItem', hide: true },
    { def: 'name', label: 'name', hide: false },
    { def: 'description', label: 'description', hide: false },
    { def: 'price', label: 'price', hide: false },

    { def: 'imageUrl', label: 'imageUrl', hide: false },
    { def: 'active', label: 'active', hide: false },
    { def: 'category', label: 'category', hide: false },
    { def: 'actions', label: 'actions', hide: false }

  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private menuItemService: MenuItemService,
    private categoryService: CategoryService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.menuItemService.findAll().subscribe((data) => this.createactive(data));
    this.menuItemService.getModelChange().subscribe(data => this.createactive(data));
    this.menuItemService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 2000 }));
  }

  createactive(data: MenuItem[]) {
    this.items=data;

    this.items.forEach(res=>{
      //Cargar nombre de categoria
      this.categoryService.findById(res.idCategory).subscribe(category=>{
        res.categoryName=category.name;
      });
    });

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  openDialog(MenuItem?: MenuItem) {
    this._dialog.open(ProductDialogComponent, {
      width: '710px',
    maxWidth: '95vw',
    autoFocus: false,
    disableClose: true,
      data: MenuItem
    });
  }



  applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    this.menuItemService
      .delete(id)
      .pipe(switchMap(() => this.menuItemService.findAll()))
      .subscribe((data) => {
        this.menuItemService.setModelChange(data);
        this.menuItemService.setMessageChange('RESERVACIÓN ELIMINADO!');
      });
  }

}
