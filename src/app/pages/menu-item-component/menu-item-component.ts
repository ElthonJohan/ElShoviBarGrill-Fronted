import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MenuItemService } from '../../services/menu-item-service';
import { CartService } from '../../services/cart-service';
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

  constructor(private menuItemService: MenuItemService, private cartService: CartService) {}

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
    // inicializar listado filtrado por defecto
    this.filteredProducts = this.products;
    this.loading = false;
  });
}

addToCart(product: any) {
  const item = {
    id: product.idMenuItem ?? product.id_menu_item ?? product.id,
    name: product.name ?? product.nombre ?? 'Producto',
    price: Number(product.price ?? product.precio ?? 0),
    quantity: 1,
    imageUrl: product.imageUrl ?? product.image_url ?? ''
  };
  this.cartService.addItem(item);
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
