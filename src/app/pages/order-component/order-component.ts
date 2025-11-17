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
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './order-component.html',
  styleUrl: './order-component.css',
})
export class OrderComponent {
   dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();

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
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.orderService.findAll().subscribe((data) => this.createTable(data));
    this.orderService.getModelChange().subscribe(data => this.createTable(data));
    this.orderService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 2000 }));
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
}
