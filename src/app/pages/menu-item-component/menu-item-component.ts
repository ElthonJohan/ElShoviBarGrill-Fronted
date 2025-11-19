import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MenuItemService } from '../../services/menu-item-service';
import { MatChipListbox,MatChipOption } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-menu-item-component',
  imports: [
    CommonModule,
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
   
  categories: any[] = [];
  products: any[] = [];
  loading = true;

  filteredProducts: any[] = [];
  selectedCategory: number | null = null;

  constructor(private menuItemService: MenuItemService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

loadCategories() {
  this.menuItemService.getCategories().subscribe(res => {
    console.log("Categorias :", res);
    this.categories = res.data ?? res;  // soporte para ambos casos
  });
}

loadProducts() {
  this.loading = true;
  this.menuItemService.getProducts().subscribe(res => {
    console.log("Productos :", res);
    this.products = res.data ?? res;
    this.loading = false;
  });
}


filterByCategory(idCategory: number | null) {
  this.selectedCategory = idCategory;

  if (idCategory === null) {
    this.filteredProducts = this.products;
    return;
  }

  this.filteredProducts = this.products.filter(
    p => p.idCategory === idCategory
  );
}


  clearFilters() {
    this.selectedCategory = null;
    this.loadProducts();
  }
}
