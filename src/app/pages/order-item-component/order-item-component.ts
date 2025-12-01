import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OrderItem } from '../../model/orderitem';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { OrderItemService } from '../../services/order-item-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderItemDialogComponent } from './order-item-dialog-component/order-item-dialog-component';
import { switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-item-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule  
  ],
  templateUrl: './order-item-component.html',
  styleUrl: './order-item-component.css',
})
export class OrderItemComponent {
  dataSource: MatTableDataSource<OrderItem> = new MatTableDataSource<OrderItem>();

  columnsDefinitions = [
    { def: 'idOrderItem', label: 'idOrderItem', hide: true },
    { def: 'quantity', label: 'quantity', hide: false },
    { def: 'unitPrice', label: 'unitPrice', hide: false },
    { def: 'idMenuItem', label: 'idMenuItem', hide: false },
    { def: 'idOrder', label: 'idOrder', hide: false },
    { def: 'actions', label: 'actions', hide: false }

  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderItemService: OrderItemService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.orderItemService.findAll().subscribe((data) => this.createTable(data));
    this.orderItemService.getModelChange().subscribe(data => this.createTable(data));
    this.orderItemService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 2000 }));
  }

  createTable(data: OrderItem[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  openDialog(table?: OrderItem) {
    const dialogRef = this._dialog.open(OrderItemDialogComponent, {
      width: '750px',
      data: table
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderItemService.findAll().subscribe(data => {
          this.orderItemService.setModelChange(data);
        });
      }
    });
  }


  applyFilter(e: any) {
    if (!this.dataSource) return;
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number) {
    this.orderItemService
      .delete(id)
      .pipe(switchMap(() => this.orderItemService.findAll()))
      .subscribe((data) => {
        this.orderItemService.setModelChange(data);
        this.orderItemService.setMessageChange('ORDER-ITEM ELIMINADO!');
      });
  }

}
