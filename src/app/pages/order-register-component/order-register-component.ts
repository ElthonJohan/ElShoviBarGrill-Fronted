import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { OrderDialogComponent } from '../order-component/order-dialog-component/order-dialog-component';
import { Order } from '../../model/order';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { OrderService } from '../../services/order-service';
import { TableService } from '../../services/table-service';
import { UserService } from '../../services/user-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../model/user';
import { Table } from '../../model/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog-component/confirm-dialog-component';
import { PaymentDialogComponent } from '../payment-component/payment-dialog-component/payment-dialog-component';

@Component({
  selector: 'app-order-register-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelect,
    MatOption,
    CommonModule,
    FormsModule,
    RouterLink
],
  templateUrl: './order-register-component.html',
  styleUrl: './order-register-component.css',
})
export class OrderRegisterComponent {

  orders:Order[]=[];
    user: User;
      table: Table;
    
  
    filterType: string = '';
  filterStatus: string = '';
   dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();
   
  columnsDefinitions = [
    { def: 'idOrder', label: 'idOrder', hide: true },
    { def: 'user', label: 'user', hide: false },
    { def: 'table', label: 'table', hide: false },
    { def: 'type', label: 'type', hide: false },
    { def: 'status', label: 'status', hide: false },
    { def: 'total', label: 'total', hide: false },
    { def: 'createdAt', label: 'createdAt', hide: false },
    { def: 'actions', label: 'actions', hide: false }
  ];


  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

constructor(
    private orderService: OrderService,
    private tableService: TableService,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderService
      .findAll()
      .subscribe((data) => this.createTable(data));
    this.orderService
      .getModelChange()
      .subscribe((data) => this.createTable(data));
    this.orderService
      .getMessageChange()
      .subscribe((data) =>
        this._snackBar.open(data, 'INFO', { duration: 2000 })
      );
  }

  createTable(data: Order[]) {

    this.orders = data;

  this.orders.forEach(res => {

    // 1. Cargar nombre del usuario
    this.userService.findById(res.idUser).subscribe(user => {
      res.userName = user.userName;
    });

    // 2. Cargar número de mesa
    if (res.idTable) {
  this.tableService.findById(res.idTable).subscribe(table => {
    res.tableNumber = table.tableNumber;
  });
} else {
  res.tableNumber = -1;  // o "Delivery"
}

  });

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

   getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  openEdit(order: Order) {
  this.router.navigate(['/pages/order', order.idOrder]);
}

  
  loadOrders() {
    this.orderService.findAll().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

    applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  applyFilters() {
    this.dataSource.filterPredicate = (data, filter) => {
      const f = JSON.parse(filter);

      const typeMatch = f.type ? data.orderType === f.type : true;
      const statusMatch = f.status ? data.status === f.status : true;

      return typeMatch && statusMatch;
    };

    this.dataSource.filter = JSON.stringify({
      type: this.filterType,
      status: this.filterStatus
    });
  }

  clearFilters() {
    this.filterType = '';
    this.filterStatus = '';
    this.applyFilters();
  }

  openPayDialog(order: Order) {
    // Si ya tiene pago asociado
  if (order.idPayment) {
    alert("Esta orden ya tiene un pago registrado.");
    return;
  }

  // Si el estado ya es COMPLETADA
  if (order.status === 'COMPLETADA') {
    alert("Esta orden ya fue completada y no requiere pago.");
    return;
  }


  const dialogRef = this._dialog.open(PaymentDialogComponent, {
    width: "400px",
    data: {
      idOrder: order.idOrder,
      total: order.totalAmount
    }
  });

  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      this.loadOrders();  // refrescar tabla
    }
  });
}


  delete(id: number) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    width: '400px',
    panelClass: 'custom-dialog-container',
    data: {
      title: "Confirmar eliminación",
      message: "¿Realmente deseas eliminar esta orden? Esta acción no se puede deshacer."
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.orderService
        .delete(id)
        .pipe(switchMap(() => this.orderService.findAll()))
        .subscribe((data) => {
          this.orderService.setModelChange(data);
          this.orderService.setMessageChange('ORDEN ELIMINADA');
        });
    }
  });
  
}
}
