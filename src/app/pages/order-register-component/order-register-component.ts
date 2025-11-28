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
import { RouterLink } from '@angular/router';

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
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
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
    this.tableService.findById(res.idTable).subscribe(table => {
      res.tableNumber = table.tableNumber;
    });

  });

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

   getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }
  
    openDialog(order?: Order) {
      this._dialog.open(OrderDialogComponent, {
        width: '710px',
        maxWidth: '95vw',
        autoFocus: false,
        disableClose: true,
        data: order,
      });
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


  delete(id: number) {
    this.orderService
          .delete(id)
          .pipe(switchMap(() => this.orderService.findAll()))
          .subscribe((data) => {
            this.orderService.setModelChange(data);
            this.orderService.setMessageChange('RESERVACIÓN ELIMINADO!');
          });
  }
}
