import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Order } from '../../model/order';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { OrderService } from '../../services/order-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OrderDialogComponent } from './order-dialog-component/order-dialog-component';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../services/cart-service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-component',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './order-component.html',
  styleUrl: './order-component.css',
})
export class OrderComponent {
   dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();
  checkoutTotal: number | null = null;
  checkoutItems: CartItem[] = [];

  columnsDefinitions = [
    { def: 'idOrder', label: 'idOrder', hide: true },
    { def: 'idUser', label: 'idUser', hide: false },
    { def: 'idTable', label: 'idTable', hide: false },
    { def: 'idPayment', label: 'idPayment', hide: false },
    { def: 'totalAmount', label: 'totalAmount', hide: false },
    { def: 'status', label: 'status', hide: false },
    { def: 'orderType', label: 'orderType', hide: false },
    { def: 'notes', label: 'notes', hide: false },
    { def: 'createdAt', label: 'createdAt', hide: false },
    { def: 'items', label: 'items', hide: false },

    { def: 'actions', label: 'actions', hide: false }

  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: OrderService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.orderService.findAll().subscribe((data) => this.createTable(data));
    this.orderService.getModelChange().subscribe(data => this.createTable(data));
    this.orderService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 2000 }));

    // leer payload de checkout (total + items) si viene desde el carrito
    try {
      const raw = localStorage.getItem('elshovi_checkout_payload');
      if (raw) {
        const parsed = JSON.parse(raw);
        this.checkoutTotal = parsed?.total ?? null;
        this.checkoutItems = parsed?.items ?? [];
        // ordenar alfabéticamente por nombre (case-insensitive)
        try {
          this.checkoutItems.sort((a: any, b: any) => {
            const na = (a?.name || '').toString().toLowerCase();
            const nb = (b?.name || '').toString().toLowerCase();
            if (na < nb) return -1;
            if (na > nb) return 1;
            return 0;
          });
        } catch (e) {
          // si algo falla, no interrumpir el flujo
          console.warn('No se pudo ordenar checkoutItems', e);
        }
        // eliminar la clave para que no se repita
        localStorage.removeItem('elshovi_checkout_payload');
      }
    } catch (e) {
      console.error('Error leyendo checkout payload', e);
    }
  }

  createTable(data: Order[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  openDialog(table?: Order) {
    this._dialog.open(OrderDialogComponent, {
      width: '750px',
      data: table
    });
  }

  applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number) {
    this.orderService
      .delete(id)
      .pipe(switchMap(() => this.orderService.findAll()))
      .subscribe((data) => {
        this.orderService.setModelChange(data);
        this.orderService.setMessageChange('CATEGORÍA ELIMINADA!');
      });
  }

  confirmOrder() {
    if (!this.checkoutItems || this.checkoutItems.length === 0) {
      this._snackBar.open('No hay items para confirmar', 'OK', { duration: 2000 });
      return;
    }

    // construir payload mínimo para backend
    const orderPayload: any = {
      totalAmount: this.checkoutTotal,
      items: this.checkoutItems.map(i => ({ idMenuItem: i.id, quantity: i.quantity, unitPrice: i.price })),
      status: 'PENDING'
    };

    this.orderService.save(orderPayload).subscribe({
      next: (res: any) => {
        this._snackBar.open('Pedido registrado correctamente', 'OK', { duration: 2000 });
        // vaciar carrito local
        this.cartService.clear();
        // opcional: recargar lista de pedidos
        this.orderService.findAll().subscribe(data => this.createTable(data));
      },
      error: (err) => {
        console.error('Error creando pedido', err);
        this._snackBar.open('Error al crear pedido', 'OK', { duration: 2000 });
      }
    });
  }
}
